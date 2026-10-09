// ==========================================
// TEMPORARY USER DATA
// ==========================================

const currentUser = JSON.parse(
    localStorage.getItem("loggedInUser")
);


// ==========================================
// ELEMENTS
// ==========================================

const userName = document.getElementById("userName");
const loginButton = document.getElementById('login');
const logoutButton = document.getElementById('logout');
const totalScoreValue = document.getElementById('totalScoreValue');
// const totalScore = calculateTotalScore(currentUser);

// ==========================================
// UPDATE NAVBAR
// ==========================================

function updateNavbar() {

    // ======================================
    // LOGGED IN
    // ======================================

    if (currentUser) {

        // console.log(currentUser);
        loginButton.classList.add("hidden");
        logoutButton.classList.remove("hidden");

        // -----------------------------
        // User Name
        // -----------------------------
        userName.textContent = currentUser.name;
        // totalScoreValue.textContent = totalScore;
    }


    // ======================================
    // LOGGED OUT
    // ======================================

    else {

        loginButton.classList.remove("hidden");
        logoutButton.classList.add("hidden");
    }
}

// ======================================
// LOG OUT THE USER
// ======================================
logoutButton.addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "../login.html";
});

// ======================================
// Animate the score
// ======================================

function animateScore(element, target) {

    let current = 5;
    const duration = 1200;
    const startTime = performance.now();

    function update(currentTime) {

        const progress = Math.min(
            (currentTime - startTime) / duration,
            1
        );

        current = Math.floor(progress * target);

        element.textContent = current.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// function calculateTotalScore(user) {
//     return user.tasks.reduce((total, task) => {
//         return total + Number(task.score || 0);
//     }, 0);
// }


// ==========================================
// INITIALIZE
// ==========================================

updateNavbar();
// animateScore(totalScoreValue, totalScore);