
const pwInput = document.getElementById('password');
const toggleBtn = document.getElementById('toggle-password');
const eyeOpen = document.getElementById('eye-open');
const eyeClosed = document.getElementById('eye-closed');

const loginBtn = document.getElementById('login-btn');
const emailInput = document.getElementById('email');


// ===============================
// Password Show / Hide
// ===============================

toggleBtn.addEventListener('click', () => {

    const showing = pwInput.type === 'text';

    pwInput.type = showing ? 'password' : 'text';

    eyeOpen.classList.toggle('hidden', !showing);
    eyeClosed.classList.toggle('hidden', showing);

    toggleBtn.setAttribute(
        'aria-label',
        showing ? 'Show password' : 'Hide password'
    );

});


// ===============================
// JSONBin
// ===============================

const BIN_URL = "https://api.jsonbin.io/v3/b/6ac3d53affd5d160534fdde8";

const ACCESS_KEY = "$2a$10$SWAIeW/xGWmRaKBGfWhsLul9RHyBMmcHrKuXcHZ8kuFgn8IFtmScO";


// ===============================
// Login
// ===============================

loginBtn.addEventListener('click', async (event) => {

    event.preventDefault();

    const email = emailInput.value.trim();
    const password = pwInput.value.trim();


    // Check empty fields
    if (!email || !password) {
        alert("Please enter your email and password.");
        return;
    }


    try {

        // Get users from JSONBin
        const response = await fetch(BIN_URL, {
            headers: {
                "X-Access-Key": ACCESS_KEY
            }
        });


        if (!response.ok) {
            throw new Error("Failed to load users.");
        }


        const data = await response.json();

        const users = data.record.users || [];


        // Find user by email
        const user = users.find(
            user => user.email.toLowerCase() === email.toLowerCase()
        );


        // User doesn't exist
        if (!user) {
            alert("User not found.");
            return;
        }


        // Check password
        if (user.password !== password) {
            alert("Incorrect password.");
            return;
        }


        // ===============================
        // Login successful
        // ===============================

        const loggedInUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            tasks: user.tasks
        };


        // Save user data
        localStorage.setItem(
            "loggedInUser",
            JSON.stringify(loggedInUser)
        );


        // Save login time
        localStorage.setItem(
            "loginTime",
            Date.now()
        );


        alert(`Welcome, ${user.name}!`);


        // Go to dashboard
        window.location.href = "../index.html";


    } catch (error) {

        console.error(error);

        alert("Something went wrong. Please try again.");

    }

});
