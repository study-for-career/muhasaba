

// ========================================
// DOM ELEMENTS
// ========================================

const cardSection = document.getElementById("cardSection");


// ===============================
// JSONBin
// ===============================

const BIN_URL = "https://api.jsonbin.io/v3/b/6ac3d53affd5d160534fdde8";

const ACCESS_KEY = "$2a$10$SWAIeW/xGWmRaKBGfWhsLul9RHyBMmcHrKuXcHZ8kuFgn8IFtmScO";

// ========================================
// HELPER FUNCTIONS
// ========================================

function formatScore(score) {
    return Number(score).toFixed(1);
}



function updateTotalScore(tasks) {
    const total = tasks.reduce(
        (sum, task) => sum + Number(task.score || 0),
        0
    );

    const totalScoreElement = document.getElementById("totalScoreValue");

    if (totalScoreElement) {
        totalScoreElement.textContent = total.toFixed(1);
    }
}



function getRuleDescription(task) {
    const rule = task.rule;

    if (rule.type === "per_unit") {
        return `প্রতি ${rule.unit} = ${formatScore(rule.pointsPerUnit)} পয়েন্ট`;
    }

    if (rule.type === "fixed") {
        return `সম্পন্ন করলে ${formatScore(rule.maxScore)} পয়েন্ট`;
    }

    if (rule.type === "time_based") {
        return "ঘুমানোর সময় অনুযায়ী পয়েন্ট";
    }

    if (rule.type === "combined") {
        return `কিয়াম + বিতর; সর্বোচ্চ ${formatScore(rule.maxScore)} পয়েন্ট`;
    }

    return "";
}

const SCORE_LOCK_DURATION = 10 * 60 * 1000; // ১0 মিনিট

function getTaskLockKey(task) {
    return `taskLock_${task.taskId}`;
}

function isTaskLocked(task) {
    const unlockTime = Number(
        localStorage.getItem(getTaskLockKey(task))
    );

    if (!unlockTime) return false;

    if (Date.now() >= unlockTime) {
        localStorage.removeItem(getTaskLockKey(task));
        return false;
    }

    return true;
}

// Disable button for 10 minites

function lockTaskButton(task, button) {
    const unlockTime = Date.now() + SCORE_LOCK_DURATION;

    localStorage.setItem(
        getTaskLockKey(task),
        String(unlockTime)
    );

    button.disabled = true;
    button.classList.add("opacity-50", "cursor-not-allowed");
    button.textContent = "১০ মিনিট অপেক্ষা করুন";
}

function updateTaskButton(task, button) {
    const locked = isTaskLocked(task);

    button.disabled = locked;

    button.classList.toggle("opacity-50", locked);
    button.classList.toggle("cursor-not-allowed", locked);

    button.textContent = locked
        ? "১০ মিনিট অপেক্ষা করুন"
        : "+ স্কোর যোগ করুন";
}

// ========================================
// CREATE TASK CARD
// ========================================

function createTaskCard(task, index) {
    const card = document.createElement("article");

    card.className = `
        task-card relative overflow-hidden
        rounded-3xl border border-white/10
        bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900
        p-5 text-white shadow-xl
        transition duration-300
        hover:-translate-y-1 hover:shadow-2xl
    `;

    card.style.animation = "taskCardEnter 0.45s ease both";
    card.style.animationDelay = `${index * 60}ms`;

    card.innerHTML = `
        <div class="flex items-center justify-between gap-3">
            <span class="rounded-full bg-white/10 px-3 py-1 text-xs">
                TASK ${String(task.taskId).padStart(2, "0")}
            </span>

            <span class="text-xs text-indigo-200">
                Daily Practice
            </span>
        </div>

        <div class="py-7">
            <h2 class="text-xl font-bold leading-relaxed">
                ${task.task}
            </h2>

            <p class="mt-2 text-sm text-slate-300">
                ${getRuleDescription(task)}
            </p>
        </div>

        <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p class="text-xs text-slate-300">মোট স্কোর</p>

            <p class="task-score mt-1 text-3xl font-bold tabular-nums">
                ${formatScore(task.score)}
            </p>
        </div>

        <button
            type="button"
            class="add-score-btn mt-5 w-full rounded-xl bg-indigo-500 px-4 py-3 font-semibold transition hover:bg-indigo-400 active:scale-[0.98]"
        >
            + স্কোর যোগ করুন
        </button>
    `;

    const addScoreButton = card.querySelector(".add-score-btn");

    updateTaskButton(task, addScoreButton);

    addScoreButton.addEventListener("click", () => {

        const loggedInUser = localStorage.getItem("loggedInUser");

        if (!loggedInUser) {
            window.location.href = "./pages/login.html";
            return;
        }


        if (isTaskLocked(task)) {
            updateTaskButton(task, addScoreButton);
            return;
        }

        openScoreModal(task, card);
    });

    cardSection.appendChild(card);

    return card;
}


// ========================================
// SCORE MODAL
// ========================================

function openScoreModal(task, card) {
    document.getElementById("scoreModal")?.remove();

    const modal = document.createElement("div");

    modal.id = "scoreModal";
    modal.className = `
        fixed inset-0 z-50 flex items-center justify-center
        bg-black/70 px-4 py-6 backdrop-blur-sm
    `;

    modal.innerHTML = `
        <div class="relative w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 text-white shadow-2xl">

            <button
                type="button"
                class="close-modal absolute right-4 top-4 rounded-full bg-white/10 px-3 py-1 hover:bg-white/20"
                aria-label="Close"
            >✕</button>

            <div class="mb-5 pr-8">
                <h2 class="text-xl font-bold">${task.task}</h2>
                <p class="mt-1 text-sm text-slate-400">
                    বর্তমান স্কোর: ${formatScore(task.score)}
                </p>
            </div>

            <div class="score-form space-y-4"></div>
        </div>
    `;

    document.body.appendChild(modal);

    const form = modal.querySelector(".score-form");
    const rule = task.rule;

    if (rule.type === "per_unit") {
        form.innerHTML = `
            <label class="block text-sm text-slate-300">
                কত ${rule.unit}?
                <input
                    type="number"
                    class="quantity-input mt-2 w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none focus:border-indigo-400"
                    min="0"
                    ${rule.maxUnits !== undefined ? `max="${rule.maxUnits}"` : ""}
                    step="1"
                    placeholder="${rule.unit} সংখ্যা"
                >
            </label>

            <p class="text-sm text-slate-400">
                প্রতি ${rule.unit}: ${formatScore(rule.pointsPerUnit)} পয়েন্ট
            </p>

            <button type="button" class="save-score w-full rounded-xl bg-indigo-500 px-4 py-3 font-semibold hover:bg-indigo-400">
                স্কোর সংরক্ষণ করুন
            </button>
        `;
    }

    if (rule.type === "fixed") {
        form.innerHTML = `
            <p class="text-sm text-slate-300">
                কাজটি সম্পন্ন করলে ${formatScore(rule.maxScore)} পয়েন্ট যোগ হবে।
            </p>

            <button type="button" class="save-score w-full rounded-xl bg-indigo-500 px-4 py-3 font-semibold hover:bg-indigo-400">
                সম্পন্ন করেছি
            </button>
        `;
    }

    if (rule.type === "time_based") {
        form.innerHTML = `
            <label class="block text-sm text-slate-300">
                ঘুমানোর সময় নির্বাচন করুন

                <select class="time-select mt-2 w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-white">
                    <option value="">সময় নির্বাচন করুন</option>
                    <option value="before_11">রাত ১১টার আগে — 10.0 পয়েন্ট</option>
                    <option value="between_11_and_12">রাত ১১টা–১২টা — 5.0 পয়েন্ট</option>
                    <option value="after_12">রাত ১২টার পরে — 0.0 পয়েন্ট</option>
                </select>
            </label>

            <button type="button" class="save-score w-full rounded-xl bg-indigo-500 px-4 py-3 font-semibold hover:bg-indigo-400">
                স্কোর সংরক্ষণ করুন
            </button>
        `;
    }

    if (rule.type === "combined") {
        form.innerHTML = `
            <label class="block text-sm text-slate-300">
                কিয়ামের রাকাত

                <input
                    type="number"
                    class="qiyam-input mt-2 w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none focus:border-indigo-400"
                    min="0"
                    max="${rule.qiyam.maxUnits}"
                    step="1"
                    value="0"
                >
            </label>

            <div class="rounded-xl bg-white/5 p-4">
                <p class="text-sm text-slate-300">বিতরের নির্ধারিত পয়েন্ট</p>
                <p class="mt-1 text-xl font-bold">+${formatScore(rule.witr.points)}</p>
                <p class="mt-1 text-xs text-slate-400">
                    কিয়ামের রাকাত ০ হলেও এই পয়েন্ট যোগ হবে।
                </p>
            </div>

            <button type="button" class="save-score w-full rounded-xl bg-indigo-500 px-4 py-3 font-semibold hover:bg-indigo-400">
                স্কোর সংরক্ষণ করুন
            </button>
        `;
    }

    modal.querySelector(".close-modal").addEventListener("click", () => {
        modal.remove();
    });

    modal.addEventListener("click", (event) => {
        if (event.target === modal) modal.remove();
    });

    modal.querySelector(".save-score").addEventListener("click", () => {
        saveTaskScore(task, card, modal);
    });
}


// ========================================
// SAVE TASK SCORE
// ========================================


async function saveTaskScore(task, card, modal) {
    const rule = task.rule;
    let addedScore = 0;

    // 1. Calculate score
    if (rule.type === "per_unit") {
        const input = modal.querySelector(".quantity-input");
        const rawValue = input.value;

        if (rawValue.trim() === "") {
            alert("সংখ্যা লিখুন।");
            return;
        }

        const quantity = Number(rawValue);

        if (!Number.isInteger(quantity) || quantity < 0) {
            alert("শূন্য বা তার চেয়ে বড় পূর্ণসংখ্যা দিন।");
            return;
        }

        if (rule.maxUnits !== undefined && quantity > rule.maxUnits) {
            alert(`সর্বোচ্চ ${rule.maxUnits} ${rule.unit} দেওয়া যাবে।`);
            return;
        }

        addedScore = quantity * rule.pointsPerUnit;

        if (rule.maxScore !== undefined) {
            addedScore = Math.min(addedScore, rule.maxScore);
        }
    } else if (rule.type === "fixed") {
        addedScore = rule.maxScore;
    } else if (rule.type === "time_based") {
        const selectedTime = modal.querySelector(".time-select").value;

        if (!selectedTime) {
            alert("সময় নির্বাচন করুন।");
            return;
        }

        addedScore = rule.points[selectedTime];
    } else if (rule.type === "combined") {
        const input = modal.querySelector(".qiyam-input");

        if (input.value.trim() === "") {
            alert("কিয়ামের রাকাত লিখুন।");
            return;
        }

        const qiyam = Number(input.value);

        if (
            !Number.isInteger(qiyam) ||
            qiyam < 0 ||
            qiyam > rule.qiyam.maxUnits
        ) {
            alert(`রাকাত ০ থেকে ${rule.qiyam.maxUnits} এর মধ্যে দিন।`);
            return;
        }

        addedScore =
            qiyam * rule.qiyam.pointsPerUnit +
            rule.witr.points;

        addedScore = Math.min(addedScore, rule.maxScore);
    } else {
        alert("এই task-এর score rule সঠিক নয়।");
        return;
    }

    addedScore = Number(addedScore.toFixed(1));

    // 2. Check logged-in user
    const loggedInUser = JSON.parse(
        localStorage.getItem("loggedInUser") || "null"
    );

    if (!loggedInUser?.email) {
        window.location.href = "./login.html";
        return;
    }

    const button = card.querySelector(".add-score-btn");

    if (isTaskLocked(task)) {
        updateTaskButton(task, button);
        return;
    }

    // Prevent repeated submission while saving
    const saveButton = modal.querySelector(
        ".save-score"
    );

    if (saveButton?.disabled) return;

    if (saveButton) {
        saveButton.disabled = true;
        saveButton.textContent = "সেভ হচ্ছে...";
    }

    try {
        // 3. Get the latest complete record from JSONBin
        const response = await fetch(BIN_URL, {
            headers: {
                "X-Access-Key": ACCESS_KEY
            }
        });

        if (!response.ok) {
            throw new Error("JSONBin থেকে data load করা যায়নি।");
        }

        const result = await response.json();
        const record = result.record;
        const users = record.users || [];

        // 4. Find the correct user
        const user = users.find(
            item =>
                item.email?.toLowerCase() ===
                loggedInUser.email.toLowerCase()
        );

        if (!user) {
            throw new Error("ইউজারকে JSONBin-এ পাওয়া যায়নি।");
        }

        // 5. Find the correct task
        const savedTask = user.tasks.find(
            item => item.taskId === task.taskId
        );

        if (!savedTask) {
            throw new Error("ইউজারের task পাওয়া যায়নি।");
        }

        // 6. Update score in the latest record
        savedTask.score = Number(
            (Number(savedTask.score || 0) + addedScore).toFixed(1)
        );

        // 7. Save the entire record back to JSONBin
        const updateResponse = await fetch(BIN_URL, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-Access-Key": ACCESS_KEY
            },
            body: JSON.stringify(record)
        });

        if (!updateResponse.ok) {
            throw new Error("JSONBin-এ score save করা যায়নি।");
        }

        // 8. Update localStorage with this user's latest data
        localStorage.setItem(
            "loggedInUser",
            JSON.stringify(user)
        );

        updateTotalScore(user.tasks);

        // 9. Update the UI only after successful save
        task.score = savedTask.score;

        card.querySelector(".task-score").textContent =
            formatScore(task.score);

        lockTaskButton(task, button);
        modal.remove();

        console.log(
            `${task.task}: +${formatScore(addedScore)} points saved`
        );

    } catch (error) {
        console.error("Score save error:", error);
        alert(error.message || "স্কোর সেভ করা যায়নি। আবার চেষ্টা করুন।");

        if (saveButton) {
            saveButton.disabled = false;
            saveButton.textContent = "স্কোর সেভ করুন";
        }
    }
}



// ========================================
// INITIALIZE TASK CARDS
// ========================================


function renderTaskCards() {
    if (!cardSection) {
        console.error('HTML-এ id="cardSection" পাওয়া যায়নি।');
        return;
    }

    const loggedInUser = JSON.parse(
        localStorage.getItem("loggedInUser") || "null"
    );

    cardSection.innerHTML = "";

    // Login করা ইউজারের saved tasks
    const savedTasks = loggedInUser?.tasks || [];

    // Default rules + saved scores
    const tasksToRender = defaultTasks.map(defaultTask => {
        const savedTask = savedTasks.find(
            item =>
                Number(item.taskId) === Number(defaultTask.taskId)
        );

        return {
            ...defaultTask,
            ...(savedTask || {}),
            rule: defaultTask.rule,
            score: Number(savedTask?.score ?? defaultTask.score ?? 0)
        };
    });

    tasksToRender.forEach((task, index) => {
        createTaskCard(task, index);
    });
}



// ========================================
// CARD ANIMATION
// ========================================

const taskCardStyle = document.createElement("style");

taskCardStyle.textContent = `
    @keyframes taskCardEnter {
        from {
            opacity: 0;
            transform: translateY(12px);
        }

        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .task-card {
            animation: none !important;
            transition: none !important;
        }
    }
`;

document.head.appendChild(taskCardStyle);


// Start
renderTaskCards();



function refreshTotalScore() {
    const loggedInUser = JSON.parse(
        localStorage.getItem("loggedInUser") || "null"
    );

    if (!loggedInUser?.tasks) return;

    updateTotalScore(loggedInUser.tasks);
}

refreshTotalScore();