document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/fastest')
      .then(response => response.json())
      .then(data => {
        const tbody = document.getElementById('leaderboard-body');
        tbody.innerHTML = '';
  
        data.forEach(entry => {
          const totalSeconds = Math.floor(entry.time_seconds);
          const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
          const seconds = String(totalSeconds % 60).padStart(2, '0');
          const formattedTime = `${minutes}:${seconds}`;
  
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${entry.rank}</td>
            <td>${entry.name}</td>
            <td>${entry.class}</td>
            <td>${formattedTime}</td>
          `;
          tbody.appendChild(row);
        });
      })
      .catch(error => {
        console.error('Error fetching leaderboard data:', error);
      });
  });