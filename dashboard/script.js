fetch('output.json')
  .then(response => response.json())
  .then(data => {
    // Parse CPU load numbers
    const loadParts = data.cpu_load.trim().split(" ").map(Number);

    const ctx = document.getElementById('cpuChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['1 min', '5 min', '15 min'],
        datasets: [{
          label: 'CPU Load Average',
          data: loadParts,
          backgroundColor: 'rgba(75, 192, 192, 0.6)'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'CPU Load (1, 5, 15 min average)'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            suggestedMax: 2
          }
        }
      }
    });

    // Render memory and disk as tables
    function renderTable(containerId, lines) {
      const container = document.getElementById(containerId);
      const table = document.createElement('table');
      table.className = 'data-table';

      lines.forEach((line, index) => {
        const row = document.createElement('tr');
        const cells = line.trim().split(/\s+/);
        cells.forEach(cell => {
          const cellEl = document.createElement(index === 0 ? 'th' : 'td');
          cellEl.textContent = cell;
          row.appendChild(cellEl);
        });
        table.appendChild(row);
      });

      container.innerHTML = '';
      container.appendChild(table);
    }

    const memLines = JSON.parse(data.mem_usage.replace(/'/g, '"'));
    const diskLines = JSON.parse(data.disk_usage.replace(/'/g, '"'));

    renderTable('memory', memLines);
    renderTable('disk', diskLines);
  })
  .catch(err => console.error("Failed to load data:", err));
