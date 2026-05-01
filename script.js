// ===============================
// CONFIGURATION
// ===============================
const ROWS = 20;
const COLS = 20;
const ANIMATION_SPEED = 20;

// ===============================
// STATE VARIABLES
// ===============================
let grid = [];
let startNode = null;
let endNode = null;

// ===============================
// DOM ELEMENTS
// ===============================
const gridElement = document.getElementById("grid");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const algorithmSelect = document.getElementById("algorithm");

// ===============================
// INITIALIZATION
// ===============================
initializeGrid();
attachEventListeners();

// ===============================
// GRID CREATION
// ===============================
function initializeGrid() {
  gridElement.innerHTML = "";
  grid = [];

  for (let row = 0; row < ROWS; row++) {
    const currentRow = [];

    for (let col = 0; col < COLS; col++) {
      const cell = createCell(row, col);
      gridElement.appendChild(cell);
      currentRow.push(cell);
    }

    grid.push(currentRow);
  }
}

function createCell(row, col) {
  const cell = document.createElement("div");
  cell.classList.add("cell");

  cell.dataset.row = row;
  cell.dataset.col = col;

  cell.addEventListener("click", () => handleCellClick(cell));

  return cell;
}

// ===============================
// USER INTERACTION
// ===============================
function handleCellClick(cell) {
  if (!startNode) {
    cell.classList.add("start");
    startNode = cell;
  } else if (!endNode) {
    cell.classList.add("end");
    endNode = cell;
  } else {
    cell.classList.toggle("wall");
  }
}

function attachEventListeners() {
  startBtn.addEventListener("click", runSelectedAlgorithm);
  resetBtn.addEventListener("click", resetGrid);
}

// ===============================
// ALGORITHM SELECTION
// ===============================
function runSelectedAlgorithm() {
  if (!startNode || !endNode) {
    alert("Please select start and end nodes.");
    return;
  }

  const selectedAlgorithm = algorithmSelect.value;

  if (selectedAlgorithm === "bfs") {
    breadthFirstSearch();
  } else if (selectedAlgorithm === "dfs") {
    depthFirstSearch();
  }
}

// ===============================
// BFS IMPLEMENTATION
// ===============================
async function breadthFirstSearch() {
  const queue = [];
  const visited = new Set();

  queue.push(startNode);
  visited.add(startNode);

  while (queue.length > 0) {
    const currentNode = queue.shift();

    if (currentNode === endNode) {
      alert("Path Found (BFS)");
      return;
    }

    const neighbors = getNeighbors(currentNode);

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor) && !isWall(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);

        markVisited(neighbor);
        await delay(ANIMATION_SPEED);
      }
    }
  }

  alert("No Path Found");
}

// ===============================
// DFS IMPLEMENTATION
// ===============================
async function depthFirstSearch() {
  const stack = [];
  const visited = new Set();

  stack.push(startNode);
  visited.add(startNode);

  while (stack.length > 0) {
    const currentNode = stack.pop();

    if (currentNode === endNode) {
      alert("Path Found (DFS)");
      return;
    }

    const neighbors = getNeighbors(currentNode);

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor) && !isWall(neighbor)) {
        visited.add(neighbor);
        stack.push(neighbor);

        markVisited(neighbor);
        await delay(ANIMATION_SPEED);
      }
    }
  }

  alert("No Path Found");
}

// ===============================
// HELPER FUNCTIONS
// ===============================
function getNeighbors(cell) {
  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);

  const neighbors = [];

  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < ROWS - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < COLS - 1) neighbors.push(grid[row][col + 1]);

  return neighbors;
}

function isWall(cell) {
  return cell.classList.contains("wall");
}

function markVisited(cell) {
  if (!cell.classList.contains("start") && !cell.classList.contains("end")) {
    cell.classList.add("visited");
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ===============================
// RESET FUNCTION
// ===============================
function resetGrid() {
  startNode = null;
  endNode = null;
  initializeGrid();
}