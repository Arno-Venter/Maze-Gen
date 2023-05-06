import Cell from "./cell.js";

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
    console.log("RENDERING");
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

  async buildMaze() {
    this.setup();
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
      await sleep(20).then(() => this.render(current));
    }
  }

  solveMaze() {}
}

async function sleep(millis) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, millis);
  });
}

let diff = document.getElementById("diffSelect");
let diff_value;
diff.addEventListener("change", () => {
  diff_value = diff.value;
});

let startBtn = document.getElementById("startMazeBtn");
startBtn.addEventListener("click", () => {
  if (!diff_value) diff_value = 10;
  let mz = new MazeBuilder(800, diff_value, diff_value);
  mz.buildMaze();
});
