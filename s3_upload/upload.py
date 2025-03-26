import boto3
import json
import os
import mimetypes

# Load config
with open('s3_upload/config.json') as f:
    config = json.load(f)

bucket = config["bucket"]
region = config["region"]

session = boto3.Session()
s3 = session.client('s3', region_name=region)

def upload_file(file_path, s3_key):
    content_type, _ = mimetypes.guess_type(file_path)
    if content_type is None:
        content_type = 'application/octet-stream'  # fallback
    s3.upload_file(
        file_path, bucket, s3_key,
        ExtraArgs={'ContentType': content_type}
    )

# Upload metrics JSON
upload_file('data/output.json', 'output.json')

# Upload dashboard files
upload_file('dashboard/index.html', 'index.html')
upload_file('dashboard/script.js', 'script.js')
upload_file('dashboard/style.css', 'style.css')

print("Upload complete.")
