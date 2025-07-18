document.addEventListener("DOMContentLoaded", function () {
    const callbackForClassScore = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);

        const tableBody = document.querySelector("#classScoreTable tbody");
        tableBody.innerHTML = ""; // Clear previous rows

        let ranks = [];
        console.log("ranks array from front end", ranks);
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
        // Update Podium UI based on first 3 unique ranks
        // const seenRanks = new Set();
        // const podiumData = [];

        // for (let i = 0; i < responseData.length && podiumData.length < 3; i++) {
        //     const rank = ranks[i];

        //     if (!seenRanks.has(rank)) {
        //         seenRanks.add(rank);

        //         let imageSrc = "";
        //         let imageAlt = "";

        //         if (rank === 1) {
        //             imageSrc = "/pics/gold.png";
        //             imageAlt = "1st Place";
        //         } else if (rank === 2) {
        //             imageSrc = "/pics/silver.png";
        //             imageAlt = "2nd Place";
        //         } else if (rank === 3) {
        //             imageSrc = "/pics/bronze.png";
        //             imageAlt = "3rd Place";
        //         }

        //         podiumData.push({
        //             class: responseData[i].class,
        //             score: responseData[i].total_score,
        //             imgSrc: imageSrc,
        //             imgAlt: imageAlt,
        //             rank: rank
        //         });
        //     }
        // }

        // // Sort podiumData into display order: 2nd, 1st, 3rd
        // const podiumDisplayOrder = [2, 1, 3];
        // podiumDisplayOrder.forEach((desiredRank) => {
        //     const card = document.querySelector(`.podium-card.${getRankClass(desiredRank)}`);
        //     const entry = podiumData.find(p => p.rank === desiredRank);

        //     if (card && entry) {
        //         card.querySelector(".team-name").textContent = entry.class;
        //         card.querySelector(".score").textContent = entry.score;
        //         const img = card.querySelector("img");
        //         img.src = entry.imgSrc;
        //         img.alt = entry.imgAlt;
        //     } else if (card) {
        //         // Clear if not present (e.g. no 3rd place due to tie at 2nd)
        //         card.querySelector(".team-name").textContent = "-";
        //         card.querySelector(".score").textContent = "-";
        //         const img = card.querySelector("img");
        //         img.src = "";
        //         img.alt = "";
        //     }
        // });

        // function getRankClass(rank) {
        //     if (rank === 1) return "first";
        //     if (rank === 2) return "second";
        //     if (rank === 3) return "third";
        //     return "";
        // }

    };


    fetchMethod(currentUrl + `/class/rank`, callbackForClassScore);
});


