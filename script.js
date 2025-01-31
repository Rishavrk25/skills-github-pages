document.addEventListener("DOMContentLoaded", function () {

    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const cardStatsContainer = document.querySelector(".stat-card");

    // Initially hide the circles
    easyProgressCircle.classList.add("hidden");
    mediumProgressCircle.classList.add("hidden");
    hardProgressCircle.classList.add("hidden");

    function validateUsername(username) {
        if (username.trim() == "") {
            alert("Username should not be empty");
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,20}$/;
        const isMatching = regex.test(username);
        if (!isMatching) {
            alert("Invalid Username");
        }
        return isMatching;
    }

    function updateProgress(solved, total, label, circle) {
        const progressDegree = (solved / total) * 100;
        circle.style.setProperty('--progress-degree', `${progressDegree}deg`);
        label.textContent = `${solved}/${total}`;
    }

    function displayUserData(Data) {
        const totalEasyQues = Data.totalEasy;
        const totalMediumQues = Data.totalMedium;
        const totalHardQues = Data.totalHard;

        const solvedTotalEasyQues = Data.easySolved;
        const solvedTotalMediumQues = Data.mediumSolved;
        const solvedTotalHardQues = Data.hardSolved;

        updateProgress(solvedTotalEasyQues, totalEasyQues, easyLabel, easyProgressCircle);
        updateProgress(solvedTotalMediumQues, totalMediumQues, mediumLabel, mediumProgressCircle);
        updateProgress(solvedTotalHardQues, totalHardQues, hardLabel, hardProgressCircle);

        // Show the circles after data is fetched
        easyProgressCircle.classList.remove("hidden");
        mediumProgressCircle.classList.remove("hidden");
        hardProgressCircle.classList.remove("hidden");

        const cardData=[
            {label:"Total Solved",value:Data.totalSolved
            },
            {label:"AcceptanceRate",value:Data.acceptanceRate},
            {label:"Ranking",value:Data.ranking},
            {label:"ContributionPoints",value:Data.contributionPoints},
            
        ];
        // console.log("card ka data: ",cardData);
        // console.log(cardData[0].value);
        // console.log(cardData[1].value);
        // console.log(cardData[2].value);
        // console.log(cardData[3].value);
        cardStatsContainer.innerHTML = cardData.map(data => {
            return `
                <div class="card">
                    <h3>${data.label}</h3>
                    <p>${data.value}</p>
                </div>     
            `;
        }).join(''); // Use join('') to convert the array to a single string
    }

    async function fetchUserDetails(username) {
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
        try {
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Unable to fetch the User details");
            }
            const Data = await response.json();
            console.log("Logging data: ", Data);
            displayUserData(Data);
        } catch (error) {
            statsContainer.innerHTML = `<p>${error.message}</p>`;
        } finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }

    searchButton.addEventListener('click', function () {
        const username = usernameInput.value;
        console.log("Logging username: ", username);
        if (validateUsername(username)) {
            fetchUserDetails(username);
        }
    });
});