export default class Cell {
  constructor(x, y, size, rows, cols) {
    this.x = x; // x is row number
    this.y = y; // y is col number
    this.size = size;
    this.rows = rows;
    this.cols = cols;
    this.visited = false;
    this.walls = {
      top: true,
      right: true,
      bottom: true,
      left: true,
    };
  }

  buildCell() {
    if (this.walls.top) this.drawTop();
    if (this.walls.right) this.drawRight();
    if (this.walls.bottom) this.drawBottom();
    if (this.walls.left) this.drawLeft();
  }

  drawTop() {
    let canvas = document.getElementById("mazeCanvas");
    let ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#0099f9";
    ctx.lineWidth = 4;

    let l = (this.y * this.size) / this.cols;
    let t = (this.x * this.size) / this.rows;
    ctx.beginPath();
    ctx.moveTo(l, t);
    ctx.lineTo(l + this.size / this.cols, t);
    ctx.stroke();
  }

  drawRight() {
    let canvas = document.getElementById("mazeCanvas");
    let ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#0099f9";
    ctx.lineWidth = 4;

    let l = (this.y * this.size) / this.cols;
    let t = (this.x * this.size) / this.rows;
    ctx.beginPath();
    ctx.moveTo(l + this.size / this.cols, t);
    ctx.lineTo(
      l + this.size / this.cols,
      t + this.size / this.rows
    );
    ctx.stroke();
  }

  drawBottom() {
    let canvas = document.getElementById("mazeCanvas");
    let ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#0099f9";
    ctx.lineWidth = 4;

    let l = (this.y * this.size) / this.cols;
    let t = (this.x * this.size) / this.rows;
    ctx.beginPath();
    ctx.moveTo(l, t + this.size / this.rows);
    ctx.lineTo(
      l + this.size / this.cols,
      t + this.size / this.rows
    );
    ctx.stroke();
  }

  drawLeft() {
    let canvas = document.getElementById("mazeCanvas");
    let ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#0099f9";
    ctx.lineWidth = 4;

    let l = (this.y * this.size) / this.cols;
    let t = (this.x * this.size) / this.rows;
    ctx.beginPath();
    ctx.moveTo(l, t);
    ctx.lineTo(l, t + this.size / this.rows);
    ctx.stroke();
  }

  removeWalls(cell1, cell2) {
    let x = cell1.y - cell2.y;

    if (x === 1) {
      cell1.walls.left = false;
      cell2.walls.right = false;
    } else if (x === -1) {
      cell1.walls.right = false;
      cell2.walls.left = false;
    }

    let y = cell1.x - cell2.x;

    if (y === 1) {
      cell1.walls.top = false;
      cell2.walls.bottom = false;
    } else if (y === -1) {
      cell1.walls.bottom = false;
      cell2.walls.top = false;
    }
  }

  highlight(color) {
    let canvas = document.getElementById("mazeCanvas");
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = color;
    ctx.fillRect(
      (this.y * this.size) / this.cols +
        0.3 * (this.size / this.cols),
      (this.x * this.size) / this.rows +
        0.3 * (this.size / this.rows),
      this.size / this.cols - 0.6 * (this.size / this.cols),
      this.size / this.rows - 0.6 * (this.size / this.rows)
    );
  }

  getNeighbours(grid) {
    let neighbours = [];
    let i = {
      a: this.x - 1,
      b: this.x,
      c: this.x + 1,
    };
    let j = {
      a: this.y - 1,
      b: this.y,
      c: this.y + 1,
    };

    for (const i_prop in i)
      for (const j_prop in j)
        if (
          (i[i_prop] !== this.x || j[j_prop] !== this.y) &&
          (i[i_prop] == this.x || j[j_prop] == this.y) &&
          i[i_prop] <= this.rows - 1 &&
          i[i_prop] >= 0 &&
          j[j_prop] <= this.cols - 1 &&
          j[j_prop] >= 0 &&
          grid[i[i_prop]][j[j_prop]].movePossible(this) &&
          grid[i[i_prop]][j[j_prop]].visited == false
        ) {
          neighbours.push(grid[i[i_prop]][j[j_prop]]);
        }

    if (neighbours.length > 0) return neighbours;
    else return undefined;
  }

  getNeighbour(grid) {
    let neighbours = [];
    let i = {
      a: this.x - 1,
      b: this.x,
      c: this.x + 1,
    };
    let j = {
      a: this.y - 1,
      b: this.y,
      c: this.y + 1,
    };

    for (const i_prop in i)
      for (const j_prop in j)
        if (
          (i[i_prop] !== this.x || j[j_prop] !== this.y) &&
          (i[i_prop] == this.x || j[j_prop] == this.y) &&
          i[i_prop] <= this.rows - 1 &&
          i[i_prop] >= 0 &&
          j[j_prop] <= this.cols - 1 &&
          j[j_prop] >= 0
        ) {
          neighbours.push(grid[i[i_prop]][j[j_prop]]);
        }

    let validNeighbours = [];
    for (let i = 0; i < neighbours.length; i++)
      if (!neighbours[i].visited)
        validNeighbours.push(neighbours[i]);

    let num = Math.floor(
      Math.random() * validNeighbours.length
    );

    if (validNeighbours.length !== 0)
      return validNeighbours[num];
    else return undefined;
  }

  movePossible(cell) {
    //possible to move from cell to this
    //move backwards direction
    let x = this.y - cell.y;
    let y = this.x - cell.x;
    let possible = false;

    if (
      x === 1 &&
      cell.walls.right == false &&
      this.walls.left == false
    ) {
      possible = true;
    } else if (
      x === -1 &&
      cell.walls.left == false &&
      this.walls.right == false
    ) {
      possible = true;
    }

    if (
      y === 1 &&
      cell.walls.bottom == false &&
      this.walls.top == false
    ) {
      possible = true;
    } else if (
      y === -1 &&
      cell.walls.top == false &&
      this.walls.bottom == false
    ) {
      possible = true;
    }

    return possible;
  }
}
