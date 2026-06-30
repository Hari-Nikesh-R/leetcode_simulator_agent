// ----------------------------------------------------
// ALGOFLOW SIMULATOR LOGIC
// ----------------------------------------------------

// State variables
let currentTab = 'sorting';
let isRunning = false;
let runId = 0;
let animationSpeed = 400; // ms

// Visualizer State
let sortingArray = [];
const SORTING_SIZE = 12;

// Stack & Queue State
let linearType = 'stack'; // 'stack' or 'queue'
let linearArray = [10, 25, 48]; // Initial dummy elements

// Binary Search Tree State
class BSTNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
    this.x = 0;
    this.y = 0;
  }
}
let bstRoot = null;

// Graph / Pathfinding State
const GRID_ROWS = 15;
const GRID_COLS = 15;
let startCell = { row: 7, col: 3 };
let endCell = { row: 7, col: 11 };
let isDrawingWall = false;
let isDraggingStart = false;
let isDraggingEnd = false;
let gridMatrix = []; // row-col cells

// Beginner Explanations & Analogies Data
const EXPLANATIONS = {
  sorting: {
    bubble: {
      analogy: "Like bubbles rising in a glass of soda. The largest bubble rises to the top, then the next largest, and so on. In each pass, adjacent elements are compared and swapped if they are in the wrong order.",
      steps: [
        { title: "Comparison", desc: "Compare two adjacent elements. If the left element is greater than the right element, they are out of order." },
        { title: "Swapping", desc: "Swap them so the larger element moves towards the right side." },
        { title: "Bubbling", desc: "Repeat this process for every element. After the first round, the largest element is locked at the end of the array." }
      ]
    },
    selection: {
      analogy: "Imagine scanning a shelf of books to find the shortest one, then swapping it with the book in the first position. Next, you scan the remaining books to find the second shortest, and swap it with the second position.",
      steps: [
        { title: "Find Minimum", desc: "Scan the unsorted part of the array to find the smallest value." },
        { title: "Swap with First", desc: "Swap the minimum value found with the first element of the unsorted part." },
        { title: "Shrink Unsorted", desc: "Move the boundary of sorted items to the right by one position and repeat." }
      ]
    },
    insertion: {
      analogy: "Like sorting a hand of playing cards. You pick one card from the unsorted deck and shift cards in your sorted hand until you find the perfect spot to insert it.",
      steps: [
        { title: "Pick Element", desc: "Start from the second element. Consider it as the 'key' to insert into the sorted partition on the left." },
        { title: "Shift Elements", desc: "Compare the key with elements in the sorted partition from right to left, shifting larger elements to the right." },
        { title: "Insert Key", desc: "Drop the key into the empty space left after shifting." }
      ]
    }
  },
  linear: {
    stack: {
      analogy: "Think of a stack of dinner plates in a cafeteria. You can only place a new plate on top (Push), and you can only take a plate off the top (Pop). The last plate placed is the first one removed (Last In, First Out / LIFO).",
      steps: [
        { title: "Push (Insert)", desc: "Add an element to the top of the stack. Takes O(1) constant time." },
        { title: "Pop (Remove)", desc: "Remove the top element. If the stack is empty, it returns an Underflow error." },
        { title: "Peek (Lookup)", desc: "Inspect the top item without removing it." }
      ]
    },
    queue: {
      analogy: "Think of a line of people waiting at a ticket counter. The first person to join the line gets served first (Dequeue). New arrivals join at the back of the line (Enqueue). This is First In, First Out (FIFO).",
      steps: [
        { title: "Enqueue (Insert)", desc: "Add an element to the tail of the queue. Takes O(1) constant time." },
        { title: "Dequeue (Remove)", desc: "Remove and return the element at the head of the queue. Takes O(1) time." },
        { title: "FIFO Ordering", desc: "Preserves the exact order of elements based on arrival time." }
      ]
    }
  },
  tree: {
    bst: {
      analogy: "Imagine filing documents. If a document starts with a letter before the drawer's label, you look left; if it starts after, you look right. A Binary Search Tree does this with numbers to make searching ultra-fast (halving search space at each step).",
      steps: [
        { title: "Root Comparison", desc: "Compare the insert/search value with the current node." },
        { title: "Traverse Left", desc: "If the value is smaller than the current node, move to the left subtree." },
        { title: "Traverse Right", desc: "If the value is larger than the current node, move to the right subtree." }
      ]
    }
  },
  graph: {
    bfs: {
      analogy: "Like ripples expanding in a pool of water when a stone is dropped. BFS explores all neighbors at distance 1 first, then distance 2, then distance 3, expanding outwards evenly. It is guaranteed to find the shortest path.",
      steps: [
        { title: "Queue Initialization", desc: "Start by pushing the start node to a queue and marking it visited." },
        { title: "Level Exploration", desc: "Deqeue a node, inspect it, and add all its unvisited neighbors to the queue." },
        { title: "Shortest Path", desc: "Since it explores level-by-level, BFS is optimal for finding the shortest path in unweighted graphs." }
      ]
    },
    dfs: {
      analogy: "Like navigating a dark maze by keeping your hand on the right wall. You follow a single path as deep as possible until you hit a dead end, then backtrack to the last split-path and try again.",
      steps: [
        { title: "Recursion Stack", desc: "Use a stack (often implicit recursion) to explore the deep path." },
        { title: "Deep Dive", desc: "Immediately visit the first unvisited neighbor, going deeper without visiting other neighbors first." },
        { title: "Backtracking", desc: "When hitting a dead end (no unvisited neighbors), backtrack to find unexplored branches." }
      ]
    }
  },
  leetcode: {
    lc206: {
      analogy: "Imagine a line of people holding hands, each person pointing to the one behind them. To reverse the order, each person must turn around and point to the person standing in front of them instead. To do this without losing the line, they need a helper (next) to hold their place before they let go of the hand behind them.",
      steps: [
        { title: "Save Next Node", desc: "Store the next node pointer (`next = curr.next`) so we don't lose the rest of the list when we rewrite the pointer." },
        { title: "Reverse Pointer", desc: "Point the current node's next to the previous node (`curr.next = prev`)." },
        { title: "Shift Previous", desc: "Move the `prev` pointer forward to the current node (`prev = curr`)." },
        { title: "Shift Current", desc: "Move the `curr` pointer forward to the saved next node (`curr = next`)." }
      ]
    },
    lc20: {
      analogy: "Imagine eating matching nesting boxes, or visiting a series of rooms. Every time you enter a room with an opening door type ((, [, {), you must exit through the exact matching closing door type ( ), ], }). The order you exit must be the reverse of the order you entered (LIFO). If you try to open a door that doesn't match the last one you opened, you get trapped (Invalid!).",
      steps: [
        { title: "Opening Brackets", desc: "Push opening brackets onto a stack when scanned. This remembers the order in which they must be closed." },
        { title: "Closing Brackets", desc: "When a closing bracket is found, check if the stack is empty or if it mismatches the top of the stack. If so, it is invalid." },
        { title: "Validate Empty Stack", desc: "After scanning the entire string, the string is valid only if all brackets were matched (the stack is empty)." }
      ]
    }
  }
};

// Code Traces Database
const CODE_TRACES = {
  bubble: [
    "function bubbleSort(arr) {",
    "  let n = arr.length;",
    "  for (let i = 0; i < n; i++) {",
    "    for (let j = 0; j < n - i - 1; j++) {",
    "      if (arr[j] > arr[j+1]) {",
    "        swap(arr, j, j+1);",
    "      }",
    "    }",
    "  }",
    "}"
  ],
  selection: [
    "function selectionSort(arr) {",
    "  let n = arr.length;",
    "  for (let i = 0; i < n; i++) {",
    "    let minIdx = i;",
    "    for (let j = i + 1; j < n; j++) {",
    "      if (arr[j] < arr[minIdx]) minIdx = j;",
    "    }",
    "    if (minIdx !== i) swap(arr, i, minIdx);",
    "  }",
    "}"
  ],
  insertion: [
    "function insertionSort(arr) {",
    "  let n = arr.length;",
    "  for (let i = 1; i < n; i++) {",
    "    let key = arr[i];",
    "    let j = i - 1;",
    "    while (j >= 0 && arr[j] > key) {",
    "      arr[j + 1] = arr[j];",
    "      j--;",
    "    }",
    "    arr[j + 1] = key;",
    "  }",
    "}"
  ],
  stack: [
    "class Stack {",
    "  push(val) {",
    "    this.items.push(val); // Insert at top",
    "  }",
    "  pop() {",
    "    if (this.isEmpty()) return 'Underflow';",
    "    return this.items.pop(); // Remove from top",
    "  }",
    "}"
  ],
  queue: [
    "class Queue {",
    "  enqueue(val) {",
    "    this.items.push(val); // Insert at tail",
    "  }",
    "  dequeue() {",
    "    if (this.isEmpty()) return 'Underflow';",
    "    return this.items.shift(); // Remove from head",
    "  }",
    "}"
  ],
  bst_insert: [
    "insertNode(node, newNode) {",
    "  if (newNode.val < node.val) {",
    "    if (!node.left) node.left = newNode;",
    "    else this.insertNode(node.left, newNode);",
    "  } else {",
    "    if (!node.right) node.right = newNode;",
    "    else this.insertNode(node.right, newNode);",
    "  }",
    "}"
  ],
  bst_search: [
    "searchNode(node, val) {",
    "  if (!node) return null;",
    "  if (val === node.val) return node;",
    "  if (val < node.val)",
    "    return this.searchNode(node.left, val);",
    "  else",
    "    return this.searchNode(node.right, val);",
    "}"
  ],
  bfs: [
    "bfs(start, end) {",
    "  queue.enqueue(start);",
    "  while (!queue.isEmpty()) {",
    "    let curr = queue.dequeue();",
    "    if (curr === end) return path;",
    "    for (let neighbor of getNeighbors(curr)) {",
    "      if (!visited[neighbor]) {",
    "        visited[neighbor] = true;",
    "        parent[neighbor] = curr;",
    "        queue.enqueue(neighbor);",
    "      }",
    "    }",
    "  }",
    "}"
  ],
  dfs: [
    "dfs(curr, end) {",
    "  if (curr === end) return true;",
    "  visited[curr] = true;",
    "  for (let neighbor of getNeighbors(curr)) {",
    "    if (!visited[neighbor]) {",
    "      parent[neighbor] = curr;",
    "      if (dfs(neighbor, end)) return true;",
    "    }",
    "  }",
    "  return false;",
    "}"
  ],
  lc206: [
    "function reverseList(head) {",
    "  let prev = null;",
    "  let curr = head;",
    "  while (curr !== null) {",
    "    let next = curr.next;",
    "    curr.next = prev;",
    "    prev = curr;",
    "    curr = next;",
    "  }",
    "  return prev;",
    "}"
  ],
  lc20: [
    "function isValid(s) {",
    "  let stack = [];",
    "  for (let char of s) {",
    "    if (char === '(' || char === '[' || char === '{') {",
    "      stack.push(char);",
    "    } else {",
    "      let top = stack.pop();",
    "      if (char === ')' && top !== '(') return false;",
    "      if (char === ']' && top !== '[') return false;",
    "      if (char === '}' && top !== '{') return false;",
    "    }",
    "  }",
    "  return stack.length === 0;",
    "}"
  ]
};

// ----------------------------------------------------
// INITIALIZATION
// ----------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  setupTabListeners();
  setupSpeedListener();
  setupControls();
  switchTab('sorting');
});

// Sleep Helper
function sleep() {
  return new Promise(resolve => setTimeout(resolve, animationSpeed));
}

// ----------------------------------------------------
// TAB NAVIGATION MANAGEMENT
// ----------------------------------------------------
function setupTabListeners() {
  const tabs = document.querySelectorAll('.nav-item');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      if (isRunning) {
        alert("Wait for the current visualization to complete, or reset it!");
        return;
      }
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      switchTab(tab.dataset.tab);
    });
  });
}

function setupSpeedListener() {
  const slider = document.getElementById('speed-slider');
  const speedVal = document.getElementById('speed-value');
  slider.addEventListener('input', (e) => {
    animationSpeed = parseInt(e.target.value);
    speedVal.innerText = `${animationSpeed}ms`;
  });
}

function switchTab(tabName) {
  currentTab = tabName;
  runId++; // Break ongoing loops
  isRunning = false;
  updateStatus("Ready");
  
  // Hide all control groups
  document.querySelectorAll('.control-group').forEach(group => group.classList.remove('active'));
  
  // Show specific controls
  const activeControl = document.getElementById(`controls-${tabName}`);
  if (activeControl) activeControl.classList.add('active');
  
  // Clear Viewport
  const viewport = document.getElementById('visualizer-viewport');
  viewport.innerHTML = '';
  
  // Setup header text & complexities
  const title = document.getElementById('current-title');
  const desc = document.getElementById('current-desc');
  const timeComp = document.getElementById('time-complexity');
  const spaceComp = document.getElementById('space-complexity');
  
  if (tabName === 'sorting') {
    title.innerText = "Sorting Algorithms";
    desc.innerText = "Observe how elements are rearranged using comparisons and swaps.";
    timeComp.innerText = "O(n²)";
    spaceComp.innerText = "O(1)";
    
    setCodeTrace(CODE_TRACES.bubble);
    loadExplanation('sorting', 'bubble');
    generateSortingArray();
  } 
  else if (tabName === 'linear') {
    title.innerText = "Stack & Queue (Linear DS)";
    desc.innerText = "Explore LIFO (Last In First Out) vs FIFO (First In First Out) operations.";
    timeComp.innerText = "O(1) Push/Pop";
    spaceComp.innerText = "O(n)";
    
    const linearSel = document.getElementById('linear-type');
    linearSel.value = 'stack';
    linearType = 'stack';
    setCodeTrace(CODE_TRACES.stack);
    loadExplanation('linear', 'stack');
    renderLinearVisualizer();
  } 
  else if (tabName === 'tree') {
    title.innerText = "Binary Search Tree (BST)";
    desc.innerText = "Values smaller than parent go left, values larger go right.";
    timeComp.innerText = "O(log n) Avg";
    spaceComp.innerText = "O(n)";
    
    setCodeTrace(CODE_TRACES.bst_insert);
    loadExplanation('tree', 'bst');
    initializeBST();
  } 
  else if (tabName === 'graph') {
    title.innerText = "Pathfinding Visualizer";
    desc.innerText = "Search nodes in graphs and grids to find paths.";
    timeComp.innerText = "O(V + E)";
    spaceComp.innerText = "O(V)";
    
    setCodeTrace(CODE_TRACES.bfs);
    loadExplanation('graph', 'bfs');
    generatePathfindingGrid();
  }
  else if (tabName === 'leetcode') {
    title.innerText = "LeetCode Simulator";
    desc.innerText = "Simulate LeetCode solutions step-by-step to understand mental models.";
    
    const problemSel = document.getElementById('leetcode-select');
    problemSel.value = 'lc206';
    switchLeetCodeProblem('lc206');
  }
}

// ----------------------------------------------------
// UI TRACER & EXPLANATION HELPERS
// ----------------------------------------------------
function setCodeTrace(lines) {
  const codeContainer = document.querySelector('#code-container code');
  codeContainer.innerHTML = lines.map((line, idx) => 
    `<span class="code-line" id="line-${idx}">${escapeHtml(line)}</span>`
  ).join('');
}

function highlightLine(lineNum) {
  document.querySelectorAll('.code-line').forEach(line => line.classList.remove('highlight'));
  const activeLine = document.getElementById(`line-${lineNum}`);
  if (activeLine) activeLine.classList.add('highlight');
}

function updateStatus(text, type = 'ready') {
  const statusEl = document.getElementById('visualizer-status');
  statusEl.innerText = text;
  if (type === 'running') {
    statusEl.className = 'visualizer-status running';
  } else {
    statusEl.className = 'visualizer-status';
  }
}

function loadExplanation(category, item) {
  const target = EXPLANATIONS[category][item];
  const container = document.getElementById('explanation-content');
  if (!target) return;
  
  let html = `
    <div class="analogy-box">
      <div class="analogy-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
        </svg>
        <span>Real-world Analogy</span>
      </div>
      <p class="analogy-text">${target.analogy}</p>
    </div>
    <div class="steps-list">
  `;
  
  target.steps.forEach((step, idx) => {
    html += `
      <div class="step-item">
        <h4><span>${idx + 1}</span> ${step.title}</h4>
        <p>${step.desc}</p>
      </div>
    `;
  });
  
  html += `</div>`;
  container.innerHTML = html;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ----------------------------------------------------
// CONTROLS ATTACHMENTS
// ----------------------------------------------------
function setupControls() {
  // 1. Sorting controls
  const sortSelect = document.getElementById('sort-select');
  sortSelect.addEventListener('change', (e) => {
    const val = e.target.value;
    const timeComp = document.getElementById('time-complexity');
    const spaceComp = document.getElementById('space-complexity');
    
    if (val === 'bubble') {
      timeComp.innerText = "O(n²)";
      spaceComp.innerText = "O(1)";
      setCodeTrace(CODE_TRACES.bubble);
    } else if (val === 'selection') {
      timeComp.innerText = "O(n²)";
      spaceComp.innerText = "O(1)";
      setCodeTrace(CODE_TRACES.selection);
    } else if (val === 'insertion') {
      timeComp.innerText = "O(n²)";
      spaceComp.innerText = "O(1)";
      setCodeTrace(CODE_TRACES.insertion);
    }
    loadExplanation('sorting', val);
  });
  
  document.getElementById('btn-sort-start').addEventListener('click', runSortingVisualizer);
  document.getElementById('btn-sort-reset').addEventListener('click', () => {
    runId++;
    isRunning = false;
    updateStatus("Ready");
    generateSortingArray();
  });
  
  // 2. Linear controls
  const linearTypeSel = document.getElementById('linear-type');
  linearTypeSel.addEventListener('change', (e) => {
    linearType = e.target.value;
    const timeComp = document.getElementById('time-complexity');
    if (linearType === 'stack') {
      timeComp.innerText = "O(1) Push/Pop";
      setCodeTrace(CODE_TRACES.stack);
    } else {
      timeComp.innerText = "O(1) Enq/Deq";
      setCodeTrace(CODE_TRACES.queue);
    }
    loadExplanation('linear', linearType);
    renderLinearVisualizer();
  });
  
  document.getElementById('btn-linear-push').addEventListener('click', linearPushEnqueue);
  document.getElementById('btn-linear-pop').addEventListener('click', linearPopDequeue);
  document.getElementById('btn-linear-clear').addEventListener('click', () => {
    linearArray = [];
    renderLinearVisualizer();
  });
  
  // 3. Tree controls
  document.getElementById('btn-tree-insert').addEventListener('click', treeInsertNode);
  document.getElementById('btn-tree-search').addEventListener('click', treeSearchNode);
  document.getElementById('btn-tree-clear').addEventListener('click', () => {
    bstRoot = null;
    renderBSTVisualizer();
  });
  
  // 4. Graph controls
  const graphAlgoSel = document.getElementById('graph-algo');
  graphAlgoSel.addEventListener('change', (e) => {
    const val = e.target.value;
    if (val === 'bfs') {
      setCodeTrace(CODE_TRACES.bfs);
    } else {
      setCodeTrace(CODE_TRACES.dfs);
    }
    loadExplanation('graph', val);
  });
  
  document.getElementById('btn-graph-start').addEventListener('click', runPathfindingVisualizer);
  document.getElementById('btn-graph-clear-walls').addEventListener('click', clearGraphWalls);
  document.getElementById('btn-graph-reset').addEventListener('click', () => {
    runId++;
    isRunning = false;
    updateStatus("Ready");
    generatePathfindingGrid();
  });
  
  // 5. LeetCode controls
  const leetcodeSel = document.getElementById('leetcode-select');
  leetcodeSel.addEventListener('change', (e) => {
    switchLeetCodeProblem(e.target.value);
  });
  
  document.getElementById('btn-leetcode-start').addEventListener('click', runLeetCodeSimulation);
  document.getElementById('btn-leetcode-reset').addEventListener('click', () => {
    runId++;
    isRunning = false;
    updateStatus("Ready");
    const activeProblem = document.getElementById('leetcode-select').value;
    if (activeProblem === 'lc206') {
      generateLeetCodeInput();
    } else {
      generateLC20Input();
    }
  });
}

// ----------------------------------------------------
// 1. SORTING VISUALIZER LOGIC
// ----------------------------------------------------
function generateSortingArray() {
  sortingArray = [];
  const viewport = document.getElementById('visualizer-viewport');
  viewport.innerHTML = '';
  
  const container = document.createElement('div');
  container.className = 'sorting-container';
  viewport.appendChild(container);
  
  for (let i = 0; i < SORTING_SIZE; i++) {
    const val = Math.floor(Math.random() * 80) + 15; // Range 15 to 95
    sortingArray.push(val);
    
    const bar = document.createElement('div');
    bar.className = 'sort-bar';
    bar.style.height = `${val * 2.5}px`;
    bar.id = `bar-${i}`;
    
    const label = document.createElement('span');
    label.className = 'sort-bar-value';
    label.innerText = val;
    bar.appendChild(label);
    
    container.appendChild(bar);
  }
}

async function runSortingVisualizer() {
  if (isRunning) return;
  isRunning = true;
  updateStatus("Running Sort...", 'running');
  const localRunId = runId;
  
  const algo = document.getElementById('sort-select').value;
  try {
    if (algo === 'bubble') {
      await bubbleSort(localRunId);
    } else if (algo === 'selection') {
      await selectionSort(localRunId);
    } else if (algo === 'insertion') {
      await insertionSort(localRunId);
    }
    
    if (localRunId === runId) {
      updateStatus("Sorted Successfully!");
      highlightLine(-1);
    }
  } catch (err) {
    // Aborted
  } finally {
    if (localRunId === runId) {
      isRunning = false;
    }
  }
}

// Helper: visual swap
function swapBars(i, j) {
  const barI = document.getElementById(`bar-${i}`);
  const barJ = document.getElementById(`bar-${j}`);
  if (barI && barJ) {
    const tempHeight = barI.style.height;
    barI.style.height = barJ.style.height;
    barJ.style.height = tempHeight;
    
    const valI = barI.querySelector('.sort-bar-value').innerText;
    const valJ = barJ.querySelector('.sort-bar-value').innerText;
    barI.querySelector('.sort-bar-value').innerText = valJ;
    barJ.querySelector('.sort-bar-value').innerText = valI;
  }
}

function updateBarHeights(i, val) {
  const bar = document.getElementById(`bar-${i}`);
  if (bar) {
    bar.style.height = `${val * 2.5}px`;
    bar.querySelector('.sort-bar-value').innerText = val;
  }
}

function highlightBars(indices, stateClass) {
  indices.forEach(idx => {
    const bar = document.getElementById(`bar-${idx}`);
    if (bar) {
      bar.classList.remove('active', 'selected', 'sorted');
      if (stateClass !== 'reset') {
        bar.classList.add(stateClass);
      }
    }
  });
}

// Bubble Sort Implementation
async function bubbleSort(localRunId) {
  let n = sortingArray.length;
  for (let i = 0; i < n; i++) {
    highlightLine(2); // i loop
    await sleep();
    if (localRunId !== runId) return;
    
    for (let j = 0; j < n - i - 1; j++) {
      highlightLine(3); // j loop
      highlightBars([j, j+1], 'active');
      await sleep();
      if (localRunId !== runId) return;
      
      highlightLine(4); // Comparison
      await sleep();
      if (localRunId !== runId) return;
      
      if (sortingArray[j] > sortingArray[j+1]) {
        highlightLine(5); // swap code
        // Swap data
        let temp = sortingArray[j];
        sortingArray[j] = sortingArray[j+1];
        sortingArray[j+1] = temp;
        
        swapBars(j, j+1);
        highlightBars([j, j+1], 'selected');
        await sleep();
        if (localRunId !== runId) return;
      }
      highlightBars([j, j+1], 'reset');
    }
    // Set sorted flag
    const sortedIdx = n - i - 1;
    document.getElementById(`bar-${sortedIdx}`).classList.add('sorted');
  }
}

// Selection Sort Implementation
async function selectionSort(localRunId) {
  let n = sortingArray.length;
  for (let i = 0; i < n; i++) {
    highlightLine(2); // Outer loop
    let minIdx = i;
    highlightBars([i], 'selected');
    await sleep();
    if (localRunId !== runId) return;
    
    for (let j = i + 1; j < n; j++) {
      highlightLine(3); // Inner loop
      highlightBars([j], 'active');
      await sleep();
      if (localRunId !== runId) return;
      
      highlightLine(4); // min comparison
      await sleep();
      if (localRunId !== runId) return;
      
      if (sortingArray[j] < sortingArray[minIdx]) {
        if (minIdx !== i) {
          highlightBars([minIdx], 'reset'); // Unhighlight old min
        }
        minIdx = j;
        highlightBars([minIdx], 'selected');
        await sleep();
        if (localRunId !== runId) return;
      } else {
        highlightBars([j], 'reset');
      }
    }
    
    highlightLine(6); // Swap evaluation
    await sleep();
    if (localRunId !== runId) return;
    
    if (minIdx !== i) {
      let temp = sortingArray[i];
      sortingArray[i] = sortingArray[minIdx];
      sortingArray[minIdx] = temp;
      
      swapBars(i, minIdx);
      highlightBars([i, minIdx], 'selected');
      await sleep();
      if (localRunId !== runId) return;
    }
    
    highlightBars([i], 'sorted');
    if (minIdx !== i) {
      highlightBars([minIdx], 'reset');
    }
  }
}

// Insertion Sort Implementation
async function insertionSort(localRunId) {
  let n = sortingArray.length;
  for (let i = 1; i < n; i++) {
    highlightLine(1); // i loop
    let key = sortingArray[i];
    let j = i - 1;
    highlightBars([i], 'selected');
    await sleep();
    if (localRunId !== runId) return;
    
    highlightLine(2); // save key
    highlightLine(3); // j init
    await sleep();
    if (localRunId !== runId) return;
    
    while (j >= 0 && sortingArray[j] > key) {
      highlightLine(4); // while check
      highlightBars([j, j+1], 'active');
      await sleep();
      if (localRunId !== runId) return;
      
      highlightLine(5); // shift
      sortingArray[j+1] = sortingArray[j];
      updateBarHeights(j+1, sortingArray[j]);
      highlightBars([j+1], 'selected');
      await sleep();
      if (localRunId !== runId) return;
      
      highlightLine(6); // j--
      j--;
      await sleep();
      if (localRunId !== runId) return;
    }
    
    highlightLine(8); // insert key
    sortingArray[j+1] = key;
    updateBarHeights(j+1, key);
    highlightBars([j+1], 'sorted');
    await sleep();
    if (localRunId !== runId) return;
    
    // Clear styles for anything before sorted key
    for (let k = 0; k <= i; k++) {
      document.getElementById(`bar-${k}`).className = 'sort-bar sorted';
    }
  }
}

// ----------------------------------------------------
// 2. STACK & QUEUE VISUALIZER LOGIC
// ----------------------------------------------------
function renderLinearVisualizer() {
  const viewport = document.getElementById('visualizer-viewport');
  viewport.innerHTML = '';
  
  const container = document.createElement('div');
  container.className = 'linear-container';
  
  const label = document.createElement('div');
  label.className = 'linear-label';
  label.innerText = linearType === 'stack' ? 'Stack Visualizer' : 'Queue Visualizer';
  container.appendChild(label);
  
  const wrapper = document.createElement('div');
  wrapper.className = 'linear-wrapper';
  
  const tube = document.createElement('div');
  tube.className = linearType === 'stack' ? 'stack-tube' : 'queue-tunnel';
  
  linearArray.forEach((val, idx) => {
    const node = document.createElement('div');
    node.className = 'linear-node';
    node.innerText = val;
    node.setAttribute('data-index', idx);
    tube.appendChild(node);
  });
  
  wrapper.appendChild(tube);
  container.appendChild(wrapper);
  viewport.appendChild(container);
}

async function linearPushEnqueue() {
  if (isRunning) return;
  const inputEl = document.getElementById('linear-input');
  const val = parseInt(inputEl.value);
  if (isNaN(val) || val < 1 || val > 99) {
    alert("Please enter a valid value between 1 and 99");
    return;
  }
  
  if (linearArray.length >= 5) {
    alert("Visualizer limited to max 5 elements to maintain design neatness!");
    return;
  }
  
  isRunning = true;
  updateStatus("Inserting...", 'running');
  inputEl.value = '';
  
  if (linearType === 'stack') {
    highlightLine(1); // push() signature
    await sleep();
    
    highlightLine(2); // items.push(val)
    linearArray.push(val);
    renderLinearVisualizer();
    await sleep();
  } else {
    highlightLine(1); // enqueue() signature
    await sleep();
    
    highlightLine(2); // items.push(val)
    linearArray.push(val);
    renderLinearVisualizer();
    await sleep();
  }
  
  highlightLine(-1);
  updateStatus("Ready");
  isRunning = false;
}

async function linearPopDequeue() {
  if (isRunning) return;
  if (linearArray.length === 0) {
    alert("Structure is empty! Underflow condition.");
    return;
  }
  
  isRunning = true;
  updateStatus("Removing...", 'running');
  
  if (linearType === 'stack') {
    highlightLine(4); // pop() signature
    await sleep();
    
    highlightLine(5); // isEmpty() check
    await sleep();
    
    highlightLine(6); // items.pop()
    const topNodeIdx = linearArray.length - 1;
    const tubeNodes = document.querySelectorAll('.stack-tube .linear-node');
    
    // Find the visual top node (which is the last index)
    // In LIFO layout flex-direction: column-reverse, nodes are rendered bottom up.
    // Index top is the last DOM child
    const topNode = tubeNodes[topNodeIdx];
    if (topNode) {
      topNode.classList.add('pop-animation');
    }
    
    await sleep();
    linearArray.pop();
    renderLinearVisualizer();
  } else {
    highlightLine(4); // dequeue() signature
    await sleep();
    
    highlightLine(5); // isEmpty() check
    await sleep();
    
    highlightLine(6); // items.shift()
    const headNode = document.querySelectorAll('.queue-tunnel .linear-node')[0];
    if (headNode) {
      headNode.classList.add('pop-animation');
    }
    
    await sleep();
    linearArray.shift();
    renderLinearVisualizer();
  }
  
  highlightLine(-1);
  updateStatus("Ready");
  isRunning = false;
}

// ----------------------------------------------------
// 3. BINARY SEARCH TREE VISUALIZER LOGIC
// ----------------------------------------------------
function initializeBST() {
  bstRoot = null;
  
  // Insert some default nodes for starter visual
  insertBSTValue(50);
  insertBSTValue(30);
  insertBSTValue(70);
  insertBSTValue(20);
  insertBSTValue(40);
  
  renderBSTVisualizer();
}

function insertBSTValue(val) {
  const newNode = new BSTNode(val);
  if (!bstRoot) {
    bstRoot = newNode;
    return true;
  }
  
  let curr = bstRoot;
  let depth = 0;
  while (true) {
    depth++;
    if (depth >= 4) {
      // Limit tree depth to 4 for visual limits
      return false;
    }
    if (val === curr.val) return false; // Unique values
    if (val < curr.val) {
      if (!curr.left) {
        curr.left = newNode;
        return true;
      }
      curr = curr.left;
    } else {
      if (!curr.right) {
        curr.right = newNode;
        return true;
      }
      curr = curr.right;
    }
  }
}

function calculateBSTCoordinates(node, x, y, offset) {
  if (!node) return;
  node.x = x;
  node.y = y;
  
  calculateBSTCoordinates(node.left, x - offset, y + 60, offset * 0.5);
  calculateBSTCoordinates(node.right, x + offset, y + 60, offset * 0.5);
}

function renderBSTVisualizer() {
  const viewport = document.getElementById('visualizer-viewport');
  viewport.innerHTML = '';
  
  const container = document.createElement('div');
  container.className = 'bst-container';
  
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'bst-svg');
  
  container.appendChild(svg);
  viewport.appendChild(container);
  
  if (!bstRoot) return;
  
  // Layout math:
  const width = container.clientWidth || 500;
  calculateBSTCoordinates(bstRoot, width / 2, 40, width / 4);
  
  // Render nodes and edges
  const nodesQueue = [bstRoot];
  while (nodesQueue.length > 0) {
    const curr = nodesQueue.shift();
    
    // Create DOM element for node
    const nodeEl = document.createElement('div');
    nodeEl.className = 'bst-node';
    nodeEl.innerText = curr.val;
    nodeEl.style.left = `${curr.x}px`;
    nodeEl.style.top = `${curr.y}px`;
    nodeEl.id = `bst-node-${curr.val}`;
    container.appendChild(nodeEl);
    
    // Draw edges to left & right
    if (curr.left) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', curr.x);
      line.setAttribute('y1', curr.y);
      line.setAttribute('x2', curr.left.x);
      line.setAttribute('y2', curr.left.y);
      line.setAttribute('class', 'bst-edge');
      line.setAttribute('id', `bst-edge-${curr.val}-${curr.left.val}`);
      svg.appendChild(line);
      nodesQueue.push(curr.left);
    }
    
    if (curr.right) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', curr.x);
      line.setAttribute('y1', curr.y);
      line.setAttribute('x2', curr.right.x);
      line.setAttribute('y2', curr.right.y);
      line.setAttribute('class', 'bst-edge');
      line.setAttribute('id', `bst-edge-${curr.val}-${curr.right.val}`);
      svg.appendChild(line);
      nodesQueue.push(curr.right);
    }
  }
}

async function treeInsertNode() {
  if (isRunning) return;
  const inputEl = document.getElementById('tree-input');
  const val = parseInt(inputEl.value);
  if (isNaN(val) || val < 1 || val > 99) {
    alert("Please enter a valid node value between 1 and 99");
    return;
  }
  
  isRunning = true;
  updateStatus("Inserting Node...", 'running');
  setCodeTrace(CODE_TRACES.bst_insert);
  inputEl.value = '';
  
  if (!bstRoot) {
    bstRoot = new BSTNode(val);
    renderBSTVisualizer();
    highlightLine(0);
    await sleep();
    highlightLine(-1);
    updateStatus("Ready");
    isRunning = false;
    return;
  }
  
  let curr = bstRoot;
  let prev = null;
  let path = [];
  let depth = 0;
  
  while (curr) {
    path.push(curr.val);
    highlightLine(0);
    // highlight current node
    const nodeEl = document.getElementById(`bst-node-${curr.val}`);
    if (nodeEl) nodeEl.classList.add('active');
    await sleep();
    
    depth++;
    if (depth >= 4) {
      alert("BST visual limited to 4 levels of depth!");
      // cleanup highlight
      path.forEach(v => {
        const el = document.getElementById(`bst-node-${v}`);
        if (el) el.classList.remove('active');
      });
      highlightLine(-1);
      updateStatus("Ready");
      isRunning = false;
      return;
    }
    
    prev = curr;
    if (val === curr.val) {
      alert("Value already exists in BST!");
      path.forEach(v => {
        const el = document.getElementById(`bst-node-${v}`);
        if (el) el.classList.remove('active');
      });
      highlightLine(-1);
      updateStatus("Ready");
      isRunning = false;
      return;
    }
    
    if (val < curr.val) {
      highlightLine(1); // if (<)
      await sleep();
      
      const edge = document.getElementById(`bst-edge-${curr.val}-${curr.left ? curr.left.val : ''}`);
      if (edge) edge.classList.add('active');
      
      if (!curr.left) {
        highlightLine(2); // node.left = new
        curr.left = new BSTNode(val);
        await sleep();
        break;
      }
      highlightLine(3); // recursion
      curr = curr.left;
    } else {
      highlightLine(4); // else
      await sleep();
      
      const edge = document.getElementById(`bst-edge-${curr.val}-${curr.right ? curr.right.val : ''}`);
      if (edge) edge.classList.add('active');
      
      if (!curr.right) {
        highlightLine(5); // node.right = new
        curr.right = new BSTNode(val);
        await sleep();
        break;
      }
      highlightLine(6); // recursion
      curr = curr.right;
    }
  }
  
  renderBSTVisualizer();
  
  // Highlight the newly inserted node briefly
  const newNodeEl = document.getElementById(`bst-node-${val}`);
  if (newNodeEl) {
    newNodeEl.classList.add('insert-highlight');
  }
  
  highlightLine(-1);
  updateStatus("Ready");
  isRunning = false;
}

async function treeSearchNode() {
  if (isRunning) return;
  if (!bstRoot) {
    alert("Tree is empty!");
    return;
  }
  
  const inputEl = document.getElementById('tree-input');
  const val = parseInt(inputEl.value);
  if (isNaN(val) || val < 1 || val > 99) {
    alert("Please enter a search value between 1 and 99");
    return;
  }
  
  isRunning = true;
  updateStatus("Searching...", 'running');
  setCodeTrace(CODE_TRACES.bst_search);
  inputEl.value = '';
  
  // Reset previous highlighs
  renderBSTVisualizer();
  
  let curr = bstRoot;
  let found = false;
  let path = [];
  
  while (curr) {
    path.push(curr.val);
    highlightLine(0);
    const nodeEl = document.getElementById(`bst-node-${curr.val}`);
    if (nodeEl) nodeEl.classList.add('active');
    await sleep();
    
    highlightLine(1); // base checks
    if (curr.val === val) {
      highlightLine(2); // found it
      if (nodeEl) {
        nodeEl.classList.remove('active');
        nodeEl.classList.add('found');
      }
      found = true;
      await sleep();
      break;
    }
    
    await sleep();
    if (val < curr.val) {
      highlightLine(3); // val < node.val
      await sleep();
      
      const edge = document.getElementById(`bst-edge-${curr.val}-${curr.left ? curr.left.val : ''}`);
      if (edge) edge.classList.add('active');
      
      highlightLine(4); // traverse left
      curr = curr.left;
    } else {
      highlightLine(5); // traverse right check
      await sleep();
      
      const edge = document.getElementById(`bst-edge-${curr.val}-${curr.right ? curr.right.val : ''}`);
      if (edge) edge.classList.add('active');
      
      highlightLine(6); // traverse right
      curr = curr.right;
    }
    await sleep();
  }
  
  if (!found) {
    alert(`Value ${val} not found in the BST.`);
  }
  
  highlightLine(-1);
  updateStatus("Ready");
  isRunning = false;
}

// ----------------------------------------------------
// 4. PATHFINDING VISUALIZER LOGIC
// ----------------------------------------------------
function generatePathfindingGrid() {
  const viewport = document.getElementById('visualizer-viewport');
  viewport.innerHTML = '';
  
  const container = document.createElement('div');
  container.className = 'grid-container';
  
  gridMatrix = [];
  
  for (let r = 0; r < GRID_ROWS; r++) {
    gridMatrix[r] = [];
    for (let c = 0; c < GRID_COLS; c++) {
      const cell = document.createElement('div');
      cell.className = 'grid-cell';
      cell.dataset.row = r;
      cell.dataset.col = c;
      
      if (r === startCell.row && c === startCell.col) {
        cell.classList.add('cell-start');
      } else if (r === endCell.row && c === endCell.col) {
        cell.classList.add('cell-end');
      }
      
      // Drag/Draw Event Listeners
      cell.addEventListener('mousedown', (e) => {
        e.preventDefault();
        if (r === startCell.row && c === startCell.col) {
          isDraggingStart = true;
        } else if (r === endCell.row && c === endCell.col) {
          isDraggingEnd = true;
        } else {
          isDrawingWall = true;
          cell.classList.toggle('cell-wall');
        }
      });
      
      cell.addEventListener('mouseenter', () => {
        if (isDrawingWall) {
          if ((r !== startCell.row || c !== startCell.col) && (r !== endCell.row || c !== endCell.col)) {
            cell.classList.add('cell-wall');
          }
        } else if (isDraggingStart) {
          if (r !== endCell.row || c !== endCell.col) {
            // Remove old start
            const oldStart = document.querySelector('.cell-start');
            if (oldStart) oldStart.classList.remove('cell-start');
            startCell = { row: r, col: c };
            cell.classList.add('cell-start');
            cell.classList.remove('cell-wall');
          }
        } else if (isDraggingEnd) {
          if (r !== startCell.row || c !== startCell.col) {
            // Remove old end
            const oldEnd = document.querySelector('.cell-end');
            if (oldEnd) oldEnd.classList.remove('cell-end');
            endCell = { row: r, col: c };
            cell.classList.add('cell-end');
            cell.classList.remove('cell-wall');
          }
        }
      });
      
      container.appendChild(cell);
      gridMatrix[r][c] = cell;
    }
  }
  
  // Window-level mouseup to terminate drawing/dragging
  const stopDraw = () => {
    isDrawingWall = false;
    isDraggingStart = false;
    isDraggingEnd = false;
  };
  document.removeEventListener('mouseup', stopDraw);
  document.addEventListener('mouseup', stopDraw);
  
  viewport.appendChild(container);
}

function clearGraphWalls() {
  if (isRunning) return;
  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      gridMatrix[r][c].classList.remove('cell-wall');
    }
  }
}

async function runPathfindingVisualizer() {
  if (isRunning) return;
  isRunning = true;
  updateStatus("Finding Path...", 'running');
  const localRunId = runId;
  
  // Clear previous search visual classes
  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      gridMatrix[r][c].classList.remove('cell-visited', 'cell-path');
    }
  }
  
  const algo = document.getElementById('graph-algo').value;
  try {
    if (algo === 'bfs') {
      setCodeTrace(CODE_TRACES.bfs);
      await runBFS(localRunId);
    } else {
      setCodeTrace(CODE_TRACES.dfs);
      await runDFS(localRunId);
    }
  } catch (e) {
    // cancelled
  } finally {
    if (localRunId === runId) {
      isRunning = false;
      updateStatus("Ready");
    }
  }
}

function getNeighbors(row, col) {
  const neighbors = [];
  const dirs = [
    [-1, 0], // Top
    [1, 0],  // Bottom
    [0, -1], // Left
    [0, 1]   // Right
  ];
  
  for (let [dr, dc] of dirs) {
    const nr = row + dr;
    const nc = col + dc;
    if (nr >= 0 && nr < GRID_ROWS && nc >= 0 && nc < GRID_COLS) {
      const cell = gridMatrix[nr][nc];
      if (!cell.classList.contains('cell-wall')) {
        neighbors.push({ row: nr, col: nc });
      }
    }
  }
  return neighbors;
}

async function animatePath(parentMap, endNode, localRunId) {
  let currKey = `${endNode.row},${endNode.col}`;
  let startKey = `${startCell.row},${startCell.col}`;
  const path = [];
  
  while (currKey && currKey !== startKey) {
    const parent = parentMap[currKey];
    if (!parent) break;
    path.push(parent);
    currKey = `${parent.row},${parent.col}`;
  }
  
  path.reverse(); // Start to End direction
  
  for (let node of path) {
    if (localRunId !== runId) return;
    if (node.row === startCell.row && node.col === startCell.col) continue;
    gridMatrix[node.row][node.col].classList.add('cell-path');
    await sleep();
  }
}

// BFS Visualizer
async function runBFS(localRunId) {
  const queue = [startCell];
  const visited = new Set();
  visited.add(`${startCell.row},${startCell.col}`);
  
  const parentMap = {}; // childKey -> parentNode
  
  highlightLine(1); // queue.enqueue
  await sleep();
  if (localRunId !== runId) return;
  
  while (queue.length > 0) {
    highlightLine(2); // while
    await sleep();
    if (localRunId !== runId) return;
    
    highlightLine(3); // dequeue
    const curr = queue.shift();
    await sleep();
    if (localRunId !== runId) return;
    
    // Check if end reached
    highlightLine(4);
    if (curr.row === endCell.row && curr.col === endCell.col) {
      await animatePath(parentMap, endCell, localRunId);
      highlightLine(-1);
      return;
    }
    
    // Visit styling
    if (curr.row !== startCell.row) {
      gridMatrix[curr.row][curr.col].classList.add('cell-visited');
    }
    
    highlightLine(5); // get neighbors
    const neighbors = getNeighbors(curr.row, curr.col);
    await sleep();
    if (localRunId !== runId) return;
    
    for (let neighbor of neighbors) {
      const key = `${neighbor.row},${neighbor.col}`;
      highlightLine(6); // check visited
      if (!visited.has(key)) {
        highlightLine(7); // mark visited
        visited.add(key);
        
        highlightLine(8); // set parent
        parentMap[key] = curr;
        
        highlightLine(9); // enqueue neighbor
        queue.push(neighbor);
        await sleep();
        if (localRunId !== runId) return;
      }
    }
  }
  alert("End node is completely blocked by walls! No path exists.");
}

// DFS Visualizer
async function runDFS(localRunId) {
  const visited = new Set();
  const parentMap = {};
  let found = false;
  
  async function dfsHelper(curr) {
    if (localRunId !== runId || found) return;
    
    highlightLine(1); // check destination
    if (curr.row === endCell.row && curr.col === endCell.col) {
      found = true;
      return;
    }
    
    highlightLine(2); // mark visited
    visited.add(`${curr.row},${curr.col}`);
    if (curr.row !== startCell.row) {
      gridMatrix[curr.row][curr.col].classList.add('cell-visited');
    }
    await sleep();
    if (localRunId !== runId) return;
    
    highlightLine(3); // get neighbors
    const neighbors = getNeighbors(curr.row, curr.col);
    
    for (let neighbor of neighbors) {
      const key = `${neighbor.row},${neighbor.col}`;
      highlightLine(4); // check visited
      if (!visited.has(key)) {
        highlightLine(5); // set parent
        parentMap[key] = curr;
        
        highlightLine(6); // recursion call
        await sleep();
        if (localRunId !== runId) return;
        
        await dfsHelper(neighbor);
        if (found) return;
      }
    }
  }
  
  await dfsHelper(startCell);
  
  if (found) {
    await animatePath(parentMap, endCell, localRunId);
    highlightLine(-1);
  } else {
    alert("End node is blocked by walls! No path exists.");
  }
}

// ----------------------------------------------------
// 5. LEETCODE SIMULATOR (LC 206) LOGIC
// ----------------------------------------------------
let leetcodeListData = [1, 2, 3, 4, 5];

function generateLeetCodeInput() {
  const viewport = document.getElementById('visualizer-viewport');
  viewport.innerHTML = '';
  
  const container = document.createElement('div');
  container.className = 'leetcode-container';
  
  const label = document.createElement('div');
  label.className = 'linear-label';
  label.innerText = 'LeetCode 206: Reverse Linked List';
  container.appendChild(label);
  
  const listWrapper = document.createElement('div');
  listWrapper.className = 'linked-list-wrapper';
  listWrapper.id = 'll-wrapper';
  
  leetcodeListData.forEach((val, idx) => {
    // Add Node container
    const nodeContainer = document.createElement('div');
    nodeContainer.className = 'll-node-container';
    nodeContainer.id = `ll-node-container-${idx}`;
    
    const node = document.createElement('div');
    node.className = 'll-node';
    node.innerText = val;
    node.id = `ll-node-${idx}`;
    nodeContainer.appendChild(node);
    
    const pointers = document.createElement('div');
    pointers.className = 'll-pointer-labels';
    pointers.id = `ll-pointers-${idx}`;
    nodeContainer.appendChild(pointers);
    
    listWrapper.appendChild(nodeContainer);
    
    // Add arrow (except for the last one)
    if (idx < leetcodeListData.length - 1) {
      const arrowContainer = document.createElement('div');
      arrowContainer.className = 'll-arrow-container';
      arrowContainer.id = `ll-arrow-container-${idx}`;
      
      arrowContainer.innerHTML = `
        <svg class="ll-arrow-svg" viewBox="0 0 40 24">
          <defs>
            <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <polygon points="0 0, 6 3, 0 6" fill="var(--text-muted)"/>
            </marker>
            <marker id="arrowhead-rev" markerWidth="6" markerHeight="6" refX="1" refY="3" orient="auto">
              <polygon points="6 0, 0 3, 6 6" fill="var(--accent)"/>
            </marker>
          </defs>
          <path id="ll-arrow-path-${idx}" class="ll-arrow-path" d="M0 12 H 34" marker-end="url(#arrowhead)"/>
        </svg>
      `;
      listWrapper.appendChild(arrowContainer);
    }
  });
  
  container.appendChild(listWrapper);
  viewport.appendChild(container);
}

async function runLeetCodeSimulation() {
  if (isRunning) return;
  const activeProblem = document.getElementById('leetcode-select').value;
  if (activeProblem === 'lc206') {
    await runLC206Simulation();
  } else if (activeProblem === 'lc20') {
    await runLC20Simulation();
  }
}

function switchLeetCodeProblem(probId) {
  runId++;
  isRunning = false;
  updateStatus("Ready");
  
  const timeComp = document.getElementById('time-complexity');
  const spaceComp = document.getElementById('space-complexity');
  const inputRow = document.getElementById('leetcode-input-row');
  
  if (probId === 'lc206') {
    timeComp.innerText = "O(n)";
    spaceComp.innerText = "O(1)";
    inputRow.style.display = 'none';
    
    setCodeTrace(CODE_TRACES.lc206);
    loadExplanation('leetcode', 'lc206');
    generateLeetCodeInput();
  } else if (probId === 'lc20') {
    timeComp.innerText = "O(n)";
    spaceComp.innerText = "O(n)";
    inputRow.style.display = 'flex';
    
    setCodeTrace(CODE_TRACES.lc20);
    loadExplanation('leetcode', 'lc20');
    generateLC20Input();
  }
}

async function runLC206Simulation() {
  if (isRunning) return;
  isRunning = true;
  updateStatus("Simulating...", 'running');
  const localRunId = runId;
  
  // Reset arrows and highlights first
  generateLeetCodeInput();
  
  try {
    highlightLine(0); // function signature
    await sleep();
    if (localRunId !== runId) return;
    
    highlightLine(1); // prev = null
    let prevIdx = null;
    updatePointers(prevIdx, 0, null);
    await sleep();
    if (localRunId !== runId) return;
    
    highlightLine(2); // curr = head
    let currIdx = 0;
    updatePointers(prevIdx, currIdx, null);
    await sleep();
    if (localRunId !== runId) return;
    
    while (currIdx !== null && currIdx < leetcodeListData.length) {
      highlightLine(3); // while (curr !== null)
      await sleep();
      if (localRunId !== runId) return;
      
      highlightLine(4); // next = curr.next
      let nextIdx = currIdx + 1 < leetcodeListData.length ? currIdx + 1 : null;
      updatePointers(prevIdx, currIdx, nextIdx);
      await sleep();
      if (localRunId !== runId) return;
      
      highlightLine(5); // curr.next = prev
      // Animate reversing the arrow
      if (currIdx < leetcodeListData.length - 1) {
        const arrowPath = document.getElementById(`ll-arrow-path-${currIdx}`);
        if (arrowPath) {
          arrowPath.setAttribute('d', 'M40 12 H 6');
          arrowPath.setAttribute('marker-end', '');
          arrowPath.setAttribute('marker-start', 'url(#arrowhead-rev)');
          arrowPath.classList.add('reversed');
        }
      }
      await sleep();
      if (localRunId !== runId) return;
      
      highlightLine(6); // prev = curr
      prevIdx = currIdx;
      updatePointers(prevIdx, currIdx, nextIdx);
      await sleep();
      if (localRunId !== runId) return;
      
      highlightLine(7); // curr = next
      currIdx = nextIdx;
      updatePointers(prevIdx, currIdx, null);
      await sleep();
      if (localRunId !== runId) return;
    }
    
    highlightLine(9); // return prev
    updateStatus("Reverse Completed!");
    await sleep();
    if (localRunId !== runId) return;
    
    highlightLine(-1);
  } catch (e) {
    // cancelled
  } finally {
    if (localRunId === runId) {
      isRunning = false;
    }
  }
}

function updatePointers(prevIdx, currIdx, nextIdx) {
  // Clear tags and active classes
  document.querySelectorAll('.ll-pointer-labels').forEach(el => el.innerHTML = '');
  document.querySelectorAll('.ll-node').forEach(el => el.classList.remove('active-prev', 'active-curr', 'active-next'));
  
  if (prevIdx !== null) {
    const prevNode = document.getElementById(`ll-node-${prevIdx}`);
    if (prevNode) prevNode.classList.add('active-prev');
    const prevPointers = document.getElementById(`ll-pointers-${prevIdx}`);
    if (prevPointers) prevPointers.innerHTML += '<span class="ll-pointer-tag prev-tag">prev</span>';
  }
  
  if (currIdx !== null && currIdx < leetcodeListData.length) {
    const currNode = document.getElementById(`ll-node-${currIdx}`);
    if (currNode) currNode.classList.add('active-curr');
    const currPointers = document.getElementById(`ll-pointers-${currIdx}`);
    if (currPointers) currPointers.innerHTML += '<span class="ll-pointer-tag curr-tag">curr</span>';
  }
  
  if (nextIdx !== null && nextIdx < leetcodeListData.length) {
    const nextNode = document.getElementById(`ll-node-${nextIdx}`);
    if (nextNode) nextNode.classList.add('active-next');
    const nextPointers = document.getElementById(`ll-pointers-${nextIdx}`);
    if (nextPointers) nextPointers.innerHTML += '<span class="ll-pointer-tag next-tag">next</span>';
  }
}

// LeetCode 20: Valid Parentheses data
let lc20String = "()[]{}";

function generateLC20Input() {
  const viewport = document.getElementById('visualizer-viewport');
  viewport.innerHTML = '';
  
  const inputVal = document.getElementById('leetcode-input').value.trim();
  if (inputVal) {
    lc20String = inputVal;
  }
  
  const container = document.createElement('div');
  container.className = 'lc20-container';
  
  const label = document.createElement('div');
  label.className = 'linear-label';
  label.innerText = 'LeetCode 20: Valid Parentheses';
  container.appendChild(label);
  
  // Character row
  const stringRow = document.createElement('div');
  stringRow.className = 'lc20-string';
  stringRow.id = 'lc20-str-row';
  
  for (let i = 0; i < lc20String.length; i++) {
    const card = document.createElement('div');
    card.className = 'lc20-char-card';
    card.innerText = lc20String[i];
    card.id = `lc20-char-${i}`;
    stringRow.appendChild(card);
  }
  container.appendChild(stringRow);
  
  // Visual Stack
  const stackWrapper = document.createElement('div');
  stackWrapper.className = 'lc20-stack-wrapper';
  
  const stackLabel = document.createElement('div');
  stackLabel.className = 'linear-label';
  stackLabel.innerText = 'Helper Stack';
  stackWrapper.appendChild(stackLabel);
  
  const tube = document.createElement('div');
  tube.className = 'lc20-stack-tube';
  tube.id = 'lc20-stack-tube';
  stackWrapper.appendChild(tube);
  
  container.appendChild(stackWrapper);
  viewport.appendChild(container);
}

async function runLC20Simulation() {
  if (isRunning) return;
  isRunning = true;
  updateStatus("Simulating...", 'running');
  const localRunId = runId;
  
  generateLC20Input();
  
  const stackTube = document.getElementById('lc20-stack-tube');
  const stackData = [];
  
  try {
    highlightLine(0); // function signature
    await sleep();
    if (localRunId !== runId) return;
    
    highlightLine(1); // stack = []
    await sleep();
    if (localRunId !== runId) return;
    
    for (let i = 0; i < lc20String.length; i++) {
      highlightLine(2); // for loop
      
      // Clean previous active chars
      document.querySelectorAll('.lc20-char-card').forEach(c => c.classList.remove('active-char'));
      
      // Highlight current char card
      const charCard = document.getElementById(`lc20-char-${i}`);
      if (charCard) charCard.classList.add('active-char');
      await sleep();
      if (localRunId !== runId) return;
      
      const char = lc20String[i];
      highlightLine(3); // if opening
      await sleep();
      if (localRunId !== runId) return;
      
      if (char === '(' || char === '[' || char === '{') {
        highlightLine(4); // stack.push
        stackData.push(char);
        
        // Add visual element to stack
        const stackEl = document.createElement('div');
        stackEl.className = 'lc20-stack-element';
        stackEl.innerText = char;
        stackEl.id = `lc20-stack-el-${stackData.length - 1}`;
        stackTube.appendChild(stackEl);
        
        await sleep();
        if (localRunId !== runId) return;
      } else {
        highlightLine(5); // else
        await sleep();
        if (localRunId !== runId) return;
        
        highlightLine(6); // let top = stack.pop()
        const poppedChar = stackData.pop();
        
        // Remove visual element with animation
        const visualPopped = document.getElementById(`lc20-stack-el-${stackData.length}`);
        if (visualPopped) {
          visualPopped.classList.add('pop-animation');
          await sleep();
          if (localRunId !== runId) return;
          visualPopped.remove();
        } else {
          // Stack was empty but we tried to pop
          charCard.className = 'lc20-char-card error-char';
          highlightLine(7); // mismatch check / pop failed
          updateStatus("Invalid: Empty Stack!", 'error');
          await sleep();
          return;
        }
        
        // Match checking
        highlightLine(7); // if ')'
        await sleep();
        if (localRunId !== runId) return;
        if (char === ')' && poppedChar !== '(') {
          charCard.className = 'lc20-char-card error-char';
          updateStatus("Mismatch: ) vs " + poppedChar, 'error');
          return;
        }
        
        highlightLine(8); // if ']'
        await sleep();
        if (localRunId !== runId) return;
        if (char === ']' && poppedChar !== '[') {
          charCard.className = 'lc20-char-card error-char';
          updateStatus("Mismatch: ] vs " + poppedChar, 'error');
          return;
        }
        
        highlightLine(9); // if '}'
        await sleep();
        if (localRunId !== runId) return;
        if (char === '}' && poppedChar !== '{') {
          charCard.className = 'lc20-char-card error-char';
          updateStatus("Mismatch: } vs " + poppedChar, 'error');
          return;
        }
      }
      
      if (charCard) {
        charCard.classList.remove('active-char');
        charCard.classList.add('processed-char');
      }
    }
    
    highlightLine(12); // return stack.length === 0
    await sleep();
    if (localRunId !== runId) return;
    
    if (stackData.length === 0) {
      updateStatus("Valid Parentheses! Stack is empty.", 'ready');
      document.querySelectorAll('.lc20-char-card').forEach(card => card.className = 'lc20-char-card processed-char');
    } else {
      updateStatus("Invalid Parentheses! Unmatched opening brackets left.", 'error');
      document.querySelectorAll('.lc20-stack-element').forEach(el => el.style.background = 'var(--danger)');
      document.querySelectorAll('.lc20-char-card').forEach(card => card.className = 'lc20-char-card error-char');
    }
    
    highlightLine(-1);
  } catch (e) {
    // cancelled
  } finally {
    if (localRunId === runId) {
      isRunning = false;
    }
  }
}
