# AlgoFlow — Interactive DSA Simulator & Coach

Welcome to **AlgoFlow**, an interactive, beginner-friendly simulator designed to help you learn and prepare for Data Structures and Algorithms (DSA). 


## 📂 Repository Structure

```
├── .agents/
│   └── skills/
│       └── dsa_coach/
│           └── SKILL.md      # Custom workspace skill instructions & Big-O Cheat Sheet
├── index.html                # Main UI dashboard and glassmorphic panels layout
├── styles.css                # Premium styling (glowing nodes, animations, dark mode)
├── app.js                    # Core algorithm logic, DOM rendering, and step tracer loops
└── README.md                 # Project guide (this file)
```

---

## 🕹️ How to Get Started

### Option A: Open Directly
Simply double-click the **[index.html](file:///Users/harinikeshr/Documents/2026/projects/dsa_preparation/index.html)** file, or open it in your favorite browser (Chrome, Firefox, Safari).

### Option B: Command Line (macOS / Linux)
Navigate to this project directory and run:
```bash
open index.html
```

---

## 🧠 Using the Workspace Customization Skill

The project directory contains a custom Workspace Skill: **[dsa-coach](file:///Users/harinikeshr/Documents/2026/projects/dsa_preparation/.agents/skills/dsa_coach/SKILL.md)**. 

### How to use it with the Antigravity CLI/IDE:
1. When you run `agy` or open this project in the Antigravity IDE, the skill automatically registers in the background.
2. Ask the assistant to integrate any LeetCode problem:
   > *"Add LeetCode 21: Merge Two Sorted Lists to the simulator."*
3. The assistant will automatically read the **LeetCode Simulator Integration Protocol** in `SKILL.md` to update `index.html`, `styles.css`, and `app.js` with the correct inputs, HTML controls, code tracers, and animation engine.
