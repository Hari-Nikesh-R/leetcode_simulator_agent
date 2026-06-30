---
name: dsa-coach
description: A workspace skill to assist in learning, implementing, and visualizing Data Structures and Algorithms. Helps write clean DSA code, expand the interactive simulator, and dynamically integrate any LeetCode problem into the visualization panel.
---

# Data Structures & Algorithms (DSA) Coach Skill

Welcome to the **DSA Coach Skill**! This workspace skill is designed to help you prepare for technical interviews, understand core concepts, and extend the interactive DSA Simulator built in this workspace.

## Skill Overview

This skill helps you:
1. **Analyze Complexities**: Quickly check Time and Space complexities (Big-O) of various algorithms.
2. **Visualize Concepts**: Use the interactive Simulator (`index.html`) to visualize and trace step-by-step execution.
3. **Write Optimized Code**: Follow standard patterns for implementing stacks, queues, trees, graphs, and sorting.
4. **Simulate LeetCode Problems**: Follow the dynamic integration protocol to add custom simulation views for any LeetCode problem.

---

## Core DSA Cheat Sheet

### Time & Space Complexities

| Data Structure / Algorithm | Access / Search | Insertion | Deletion | Worst-case Space |
| :--- | :--- | :--- | :--- | :--- |
| **Array** | $O(1)$ / $O(n)$ | $O(n)$ | $O(n)$ | $O(n)$ |
| **Stack** | $O(n)$ / $O(n)$ | $O(1)$ | $O(1)$ | $O(n)$ |
| **Queue** | $O(n)$ / $O(n)$ | $O(1)$ | $O(1)$ | $O(n)$ |
| **Singly Linked List** | $O(n)$ / $O(n)$ | $O(1)$ | $O(1)$ | $O(n)$ |
| **Binary Search Tree (Balanced)** | $O(\log n)$ | $O(\log n)$ | $O(\log n)$ | $O(n)$ |
| **Binary Search Tree (Skewed)** | $O(n)$ | $O(n)$ | $O(n)$ | $O(n)$ |
| **Hash Table** | $O(1)$ (avg) | $O(1)$ (avg) | $O(1)$ (avg) | $O(n)$ |

| Algorithm | Best Time | Average Time | Worst Time | Space Complexity |
| :--- | :--- | :--- | :--- | :--- |
| **Bubble Sort** | $O(n)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ |
| **Selection Sort** | $O(n^2)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ |
| **Insertion Sort** | $O(n)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ |
| **Merge Sort** | $O(n \log n)$ | $O(n \log n)$ | $O(n \log n)$ | $O(n)$ |
| **Quick Sort** | $O(n \log n)$ | $O(n \log n)$ | $O(n^2)$ | $O(\log n)$ |
| **Binary Search** | $O(1)$ | $O(\log n)$ | $O(\log n)$ | $O(1)$ |

---

## Interactive Simulator Guide

An interactive DSA Simulator is located in the root of this workspace. To run it:
1. Open the [index.html](file:///Users/harinikeshr/Documents/2026/projects/dsa_preparation/index.html) file in your web browser.
2. Select the Data Structure or Algorithm you want to visualize from the sidebar.
3. Use the control panel to add elements, change animation speeds, and step through the pseudocode.

### Visualizer Features
- **Linear Structures**: Watch items get pushed/popped from a **Stack** or enqueued/dequeued from a **Queue**.
- **Sorting Visualizer**: See how different algorithms sort an array of bars using comparisons and swaps.
- **Binary Search Tree**: Watch how values find their place in a tree structure. Search highlights the traversal path.
- **Pathfinding Visualizer**: Click to place walls on a grid and see **BFS** (Breadth-First Search) find the shortest path, or **DFS** (Depth-First Search) explore depth-first.

---

## How to Extend the Simulator

If you want to add a new visualizer (e.g., Linked List, Merge Sort):
1. **HTML Structure**: Add a new navigation tab in [index.html](file:///Users/harinikeshr/Documents/2026/projects/dsa_preparation/index.html) and a corresponding workspace panel container.
2. **CSS Styles**: Use existing visual styles in [styles.css](file:///Users/harinikeshr/Documents/2026/projects/dsa_preparation/styles.css) or write specific styling using CSS Flexbox/Grid and custom properties.
3. **JS Logic**: Implement the step-based animation state in [app.js](file:///Users/harinikeshr/Documents/2026/projects/dsa_preparation/app.js). Use `async/await` with a custom `delay` function to control step speeds.

---

## LeetCode Simulator Integration Protocol

When the user provides a LeetCode problem (e.g., "LeetCode 206: Reverse Linked List" or "LeetCode 20: Valid Parentheses") that they want to be simulatable, follow this systematic integration checklist:

### 1. Analyze the Problem Input & Visual Representation
- **Input types**: Convert LeetCode inputs (e.g. array, linked list nodes, strings) into structured DOM components.
- **Visual Design**: Define a dedicated container layout.
  - *Example (Linked List)*: Circular nodes connected by horizontal arrows. Pointers like `prev`, `curr`, `next` visualized as labels underneath nodes.
  - *Example (Valid Parentheses)*: String characters on top, and a vertical stack below showing matching braces pushed/popped.
- **CSS classes**: Place any custom animation effects or transitions in [styles.css](file:///Users/harinikeshr/Documents/2026/projects/dsa_preparation/styles.css).

### 2. Update the HTML Layout
In [index.html](file:///Users/harinikeshr/Documents/2026/projects/dsa_preparation/index.html):
- Add a new tab `<button class="nav-item" data-tab="leetcode">` in the sidebar.
- Add corresponding control elements inside `<div id="controls-leetcode" class="control-group">`. Include inputs for custom test cases and simulation controls (e.g., "Run Simulation").

### 3. Register the Code Trace
In the `CODE_TRACES` object in [app.js](file:///Users/harinikeshr/Documents/2026/projects/dsa_preparation/app.js):
- Add the LeetCode solution function formatted as an array of code line strings. Ensure clear separation of logical steps so highlighting aligns with visual changes.

### 4. Create the Simulation Engine
In [app.js](file:///Users/harinikeshr/Documents/2026/projects/dsa_preparation/app.js):
- Define an `async` function (e.g. `runLeetCodeSimulation()`) that runs the LeetCode solver loop.
- In every execution iteration:
  - Call `highlightLine(lineIndex)` to highlight the active code line.
  - Adjust DOM elements to reflect variable value updates, pointer movements, or array indices.
  - Call `await sleep()` to wait for the animation speed interval.
- Handle state resets and cleanup on abort (i.e. if the user selects another tab or clicks reset).

### 5. Register Analogies & Explanations
In the `EXPLANATIONS` object in [app.js](file:///Users/harinikeshr/Documents/2026/projects/dsa_preparation/app.js):
- Provide a beginner-friendly analogy, complexity breakdown, and a step-by-step description of how the LeetCode solution resolves the problem.

