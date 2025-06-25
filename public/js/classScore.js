document.addEventListener("DOMContentLoaded", function () {
    const callbackForClassScore = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);

        const tableBody = document.querySelector("#classScoreTable tbody");
        tableBody.innerHTML = ""; // Clear previous rows

        let ranks = [];

        responseData.forEach((item, index) => {
            let rank;

            if (index === 0) {
                // First one is always rank 1
                rank = 1;
            } else {
                // Compare score with previous one
                if (item.total_score === responseData[index - 1].total_score) {
                    // Same score -> same rank
                    rank = ranks[index - 1];
                } else {
                    // Different score  -> rank is index + 1
                    rank = index + 1;
                }
            }

            ranks.push(rank); // Store this rank for next check

            const row = document.createElement("tr");

            const rankCell = document.createElement("td");
            rankCell.textContent = rank;

            const classCell = document.createElement("td");
            classCell.textContent = item.class;

            const scoreCell = document.createElement("td");
            scoreCell.textContent = item.total_score;

            row.appendChild(rankCell);
            row.appendChild(classCell);
            row.appendChild(scoreCell);
            tableBody.appendChild(row);
        });

    };


    fetchMethod(currentUrl + `/class/rank`, callbackForClassScore);
});
// testing practise