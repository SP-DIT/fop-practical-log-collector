document.addEventListener("DOMContentLoaded", function () {
    const callbackForClassScore = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);

        const tableBody = document.querySelector("#classScoreTable tbody");

        if (responseStatus === 404) {
            tableBody.innerHTML = `<tr><td colspan="3">${responseData.message}</td></tr>`;
            return;
        }

        tableBody.innerHTML = ""; // Clear previous rows

        responseData.forEach((item, index) => {
            const row = document.createElement("tr");

            const rankCell = document.createElement("td");
            rankCell.textContent = index + 1;

            const classCell = document.createElement("td");
            classCell.textContent = item.class;

            const scoreCell = document.createElement("td");
            scoreCell.textContent = item.score;

            row.appendChild(rankCell);
            row.appendChild(classCell);
            row.appendChild(scoreCell);

            tableBody.appendChild(row);
        });
    };


    fetchMethod(currentUrl + `/class`, callbackForClassScore);
});
// testing practise