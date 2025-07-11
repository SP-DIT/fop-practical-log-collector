document.addEventListener("DOMContentLoaded", function () {
    const callbackForFastestSolve = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);

        const tableBody = document.querySelector("#leaderboard-body");
        tableBody.innerHTML = ""; // Clear existing rows

        responseData.forEach(entry => {
            const totalSeconds = Math.floor(entry.time_seconds);
            const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
            const seconds = String(totalSeconds % 60).padStart(2, '0');
            const formattedTime = `${minutes}:${seconds}`;

            const row = document.createElement("tr");

            const rankCell = document.createElement("td");
            rankCell.textContent = entry.rank;

            const nameCell = document.createElement("td");
            nameCell.textContent = entry.name;

            const classCell = document.createElement("td");
            classCell.textContent = entry.class;

            const timeCell = document.createElement("td");
            timeCell.textContent = formattedTime;

            row.appendChild(rankCell);
            row.appendChild(nameCell);
            row.appendChild(classCell);
            row.appendChild(timeCell);

            tableBody.appendChild(row);
        });
    };

    fetchMethod("http://localhost:3000/fastest", callbackForFastestSolve);
});
