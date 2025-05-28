document.addEventListener('DOMContentLoaded', () => {
  const topicSelector = document.getElementById('tableSelector');
  const tableBody = document.getElementById('attemptsTableBody');
  let attemptsData = [];

  function renderTable(topic) {
  console.log("Selected topic:", topic);
  console.log("Available topics:", attemptsData.map(row => row.topic));

  const filtered = attemptsData
    .filter(row => row.topic === topic)
    .sort((a, b) => a.average_attempts - b.average_attempts);

  tableBody.innerHTML = '';

  if (filtered.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="4">No data available</td></tr>`;
  } else {
    filtered.forEach(entry => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${entry.rank}</td>
        <td>${entry.name}</td>
        <td>${entry.class}</td>
        <td>${entry.average_attempts}</td>
      `;
      tableBody.appendChild(tr);
    });
  }
}


  fetch('/attempts/average-attempts')
    .then(res => res.json())
    .then(data => {
      attemptsData = data;
      renderTable(topicSelector.value);
      topicSelector.addEventListener('change', () => {
        renderTable(topicSelector.value);
      });
    })
    .catch(err => {
      console.error('Error loading attempts:', err);
      tableBody.innerHTML = `<tr><td colspan="4">Error loading data</td></tr>`;
    });
});
