#!/bin/bash

# Activate Python virtual environment
source /home/lightbringer/Dev/linux-health-monitor/.venv/bin/activate
cd /home/lightbringer/Dev/linux-health-monitor

# Define log file
LOGFILE="/home/lightbringer/Dev/linux-health-monitor/cron/cron.log"

# Function to send email alert
send_alert() {
  SUBJECT="$1"
  MESSAGE="$2"
  echo "$MESSAGE" | msmtp -a default -s "$SUBJECT" lukerenchik@gmail.com
}

{
  echo "[$(date)] Running Linux Health Monitor update..."

  ansible-playbook -i ansible/inventory.ini ansible/playbook.yml
  if [ $? -ne 0 ]; then
    send_alert "[Health Monitor] Ansible failed" "Ansible playbook failed on $(hostname) at $(date). Check logs for more info."
    exit 1
  fi

  python3 s3_upload/upload.py
  if [ $? -ne 0 ]; then
    send_alert "[Health Monitor] S3 Upload failed" "S3 upload failed on $(hostname) at $(date). Check logs for more info."
    exit 1
  fi

  echo "[$(date)] Health Monitor update complete."

} >> "$LOGFILE" 2>&1
