const defaultTasks = [
    {
        taskId: 1,
        task: "জামাতে সালাত",
        score: 0,
        rule: {
            type: "per_unit",
            unit: "ওয়াক্ত",
            pointsPerUnit: 3,
            maxUnits: 5,
            maxScore: 15
        }
    },
    {
        taskId: 2,
        task: "সুন্নাত সালাত",
        score: 0,
        rule: {
            type: "per_unit",
            unit: "রাকাত",
            pointsPerUnit: 1,
            maxUnits: 12,
            maxScore: 12
        }
    },
    {
        taskId: 3,
        task: "কুরআন তেলাওয়াত",
        score: 0,
        rule: {
            type: "per_unit",
            unit: "পৃষ্ঠা",
            pointsPerUnit: 1
        }
    },
    {
        taskId: 4,
        task: "ইস্তিগফার",
        score: 0,
        rule: {
            type: "per_unit",
            unit: "বার",
            pointsPerUnit: 0.1
        }
    },
    {
        taskId: 5,
        task: "দৃষ্টি হেফাজত",
        score: 0,
        rule: {
            type: "fixed",
            maxScore: 10
        }
    },
    {
        taskId: 6,
        task: "আগে ঘুমানো",
        score: 0,
        rule: {
            type: "time_based",
            points: {
                before_11: 10,
                between_11_and_12: 5,
                after_12: 0
            }
        }
    },
    {
        taskId: 7,
        task: "কিয়ামুল লাইল",
        score: 0,
        rule: {
            type: "combined",
            qiyam: {
                unit: "রাকাত",
                pointsPerUnit: 1,
                maxUnits: 8,
                maxScore: 8
            },
            witr: {
                points: 2
            },
            maxScore: 10
        }
    },
    {
        taskId: 8,
        task: "দাওয়াহ",
        score: 0,
        rule: {
            type: "fixed",
            maxScore: 10
        }
    },
    {
        taskId: 9,
        task: "ইলম অর্জন",
        score: 0,
        rule: {
            type: "per_unit",
            unit: "পৃষ্ঠা",
            pointsPerUnit: 1
        }
    },
    {
        taskId: 10,
        task: "হাঁটা ১০ মিনিট",
        score: 0,
        rule: {
            type: "fixed",
            maxScore: 10
        }
    }
];