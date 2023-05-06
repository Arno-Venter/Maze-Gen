import Cell from "./cell.js";
const TIME = 1;

var canvas = document.getElementById("mazeCanvas");

var ctx = canvas.getContext("2d");

class MazeBuilder {
  constructor(size, rows, cols) {
    this.size = size;
    this.rows = rows;
    this.cols = cols;
    this.grid = [];
    this.stack = [];
    this.setup();
    this.shortPathStack = [];
  }

  setup() {
    canvas.height = this.size;
    canvas.width = this.size;
    for (let r = 0; r < this.rows; r++) {
      let row = [];
      for (let c = 0; c < this.cols; c++) {
        let cell = new Cell(
          r,
          c,
          this.size,
          this.rows,
          this.cols
        );
        row.push(cell);
        //cell.buildCell();
      }
      this.grid.push(row);
    }

    this.render(this.grid[0][0]);
    this.grid[0][0].visited = true;
  }

  render(current) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, this.size, this.size);

    for (let r = 0; r < this.rows; r++)
      for (let c = 0; c < this.cols; c++)
        this.grid[r][c].buildCell();

    current.highlight("#82b1f7");
    this.grid[this.rows - 1][this.cols - 1].highlight(
      "red"
    );
  }

  async sleep(millis) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, millis);
    });
  }

  async buildMaze() {
    let start = this.grid[0][0];
    this.stack.push(start);

    let current = start;
    let neighbour;

    while (this.stack.length > 0) {
      current = this.stack.pop();
      if (current.getNeighbour(this.grid)) {
        this.stack.push(current);
        neighbour = current.getNeighbour(this.grid);
        current.removeWalls(current, neighbour);
        neighbour.visited = true;
        this.stack.push(neighbour);
      }
      await this.sleep(TIME).then(() =>
        this.render(current)
      );
    }
  }

  async solveMaze() {
    let goal = this.grid[this.rows - 1][this.cols - 1];
    let current = this.grid[0][0];
    this.stack.push(current);
    this.shortPathStack.push(current);
    let neighbour;

    for (
      let r = 0;
      r < this.rows;
      r++ //set visited to false for all
    )
      for (let c = 0; c < this.cols; c++)
        this.grid[r][c].visited = false;

    this.grid[0][0].visited = true;

    while (this.stack.length > 0) {
      current = this.stack.pop();
      this.shortPathStack.pop();

      if (current.getNeighbours(this.grid)) {
        let num = Math.floor(
          Math.random() *
            current.getNeighbours(this.grid).length
        );
        neighbour = current.getNeighbours(this.grid)[num];

        if (JSON.stringify(current) == JSON.stringify(goal))
          break;
        else {
          this.stack.push(current);
          this.stack.push(neighbour);
          neighbour.visited = true;
          this.shortPathStack.push(current);
          this.shortPathStack.push(neighbour);
        }
      }

      await this.sleep(TIME).then(() =>
        this.render(current)
      );
    }
  }
}

let diff = document.getElementById("diffSelect");
let diff_value;
diff.addEventListener("change", () => {
  diff_value = diff.value;
});

let startBtn = document.getElementById("startMazeBtn");
if (!diff_value) diff_value = 10;
let mz = new MazeBuilder(800, 30, 30);

startBtn.addEventListener("click", () => {
  mz.buildMaze();
});

let solveBtn = document.getElementById("solveMazeBtn");
solveBtn.addEventListener("click", () => {
  console.log(
    mz.solveMaze().then(async () => {
      await console.log(mz.shortPathStack);
      for (let i = 0; i < mz.shortPathStack.length; i++)
        mz.shortPathStack[i].highlight("red");
    })
  );
});
