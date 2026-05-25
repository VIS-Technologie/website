fetch('../data/example.json')
    .then(r => r.json())
    .then(data => {
        new Chart(document.getElementById('chart'), {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{ label: data.title, data: data.values }]
            }
        });
    });
