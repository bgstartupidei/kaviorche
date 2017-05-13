var k;

function setup() {
  var canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('container');
  // frameRate(20)
  k = new Kaviorche()
  k.init(windowWidth, windowHeight)
}

function draw() {
  k.draw()
}

function getColors() {
  return [
    '#933535',
    '#e2404b',
    '#e2404b',
    '#5b97bb',
    '#f0d36f',
  ];
}

function getColor() {
  return random(getColors());
}

function getRectangles(width, height, min, n) {
  var rectangles = [
    [0, 0 , width, height]
  ];
  function getSplit(from, to, min) {
    var f = from + min;
    var t = to - min;
    return Math.ceil(random(f, t));
  }
  while (rectangles.length < n) {
    var r = rectangles.shift()
    var width = r[2] - r[0];
    var height = r[3] - r[1];
    if (width > height) {
        // split width
        if (width <= min) {
          rectangles.push(r);
          continue;
        }
        var splittingPoint = getSplit(r[0], r[2], min);
        rectangles.push([r[0], r[1], splittingPoint, r[3]]);
        rectangles.push([splittingPoint, r[1], r[2], r[3]]);
        continue;
    }
    // split height
    if (height <= min) {
      rectangles.push([r[0], r[1], r[2], r[3]]);
      continue;
    }
    var splittingPoint = getSplit(r[1], r[3], min);
    rectangles.push([r[0], r[1], r[2], splittingPoint])
    rectangles.push([r[0], splittingPoint, r[2], r[3]])
  }
  return rectangles;
}

function getSquares(rectangles, min) {
  var squares = [];
  rectangles.forEach((r) => {
    var width = r[2] - r[0];
    var height = r[3] - r[1];
    if (width > height) {
      if (height >= min) {
        var sq = [r[0] + Math.ceil((width-height) /2), r[1], height, height];
        squares.push(sq)
      }
      return;
    }
    if (width >= min) {
      var sq = [r[0], r[1] + Math.ceil((height - width) / 2), width, width];
      squares.push(sq);
    }
  });
  return squares;
}

figure = `0 0 0 0 0 1 0 1 1 0 1 0 0 0 0 0
0 0 0 0 0 1 0 1 1 0 1 0 0 0 0 0
0 0 3 0 0 1 1 1 1 1 1 0 0 3 0 0
0 0 3 0 0 1 1 1 1 1 1 0 0 3 0 0
0 0 3 0 0 0 1 1 1 1 0 0 0 3 0 0
0 0 3 0 0 0 1 1 1 1 0 0 0 3 0 0
0 0 3 0 0 0 0 2 2 0 0 0 0 3 0 0
0 3 0 0 2 0 0 2 2 0 0 2 0 0 3 0
0 3 0 0 2 2 0 2 2 0 2 2 0 0 3 0
0 3 0 0 2 2 0 2 2 0 2 2 0 0 3 0
0 3 0 0 0 2 0 2 2 0 2 0 0 0 3 0
0 3 0 0 0 2 2 2 2 2 2 0 0 0 3 0
0 3 0 0 0 0 2 2 2 2 0 0 0 0 3 0
0 3 0 0 0 0 0 2 2 0 0 0 0 0 3 0
0 0 0 0 0 0 0 2 2 0 0 0 0 0 0 0
0 0 0 0 0 0 0 2 2 0 0 0 0 0 0 0`;


function Kaviorche() {
  this.width;
  this.height;
  this.min = 64;
  this.currentSquare = 0;
  this.figure;

  this.init = (width, height) => {
    this.width = width;
    this.height = height;
    background('#fff');
    this.rectangles = getRectangles(width, height, this.min, 20);
    this.squares = shuffle(getSquares(this.rectangles, this.min));
    this.currentSquare = 0;
    this.figure = new Figure();
    this.pattern = figure;
    this.initFigure();
  }

  this.initFigure = () => {
    this.figure.init(
      this.pattern,
      this.squares[this.currentSquare][0],
      this.squares[this.currentSquare][1],
      Math.ceil(this.squares[this.currentSquare][2]/16)
    );
  }

  this.draw = () => {
    // this.squares.forEach((el, n) => {
    //   rect(...el);
    //   text(n, el[0]+2, el[1]+10);
    //   text(el, el[0]+2, el[1]+20);
    // });

    if (!this.figure.done()) {
      this.figure.nextFrame();
    } else {
      if (this.currentSquare < this.squares.length) {
        this.currentSquare++;
        this.initFigure()
      } else {
        this.init(this.width, this.height);
      }
    }
  }
}

function Figure() {
  this.pos = 0;

  this.init = (pattern, x, y, size) => {
    this.pos = 0;
    this.pattern = pattern.replace(/[^\d]/gmi, '');
    this.x = x;
    this.y = y;
    this.size = size;
    this.colors = shuffle(getColors());
  }

  this.nextFrame = () => {
    x = this.pos % 16
    y = Math.floor(this.pos / 16)
    clr = this.pattern[this.pos];
    if (this.pattern[this.pos] > 0) {
      stroke(this.colors[clr-1])
      line(
        this.x + x*this.size,
        this.y + y*this.size,
        this.x + x*this.size +this.size,
        this.y + y*this.size +this.size
      )
      line(
        this.x + x*this.size,
        this.y + y*this.size +this.size,
        this.x + x*this.size +this.size,
        this.y + y*this.size
      )
      // line(x, y + len, x + len, y)

      // fill(this.colors[clr-1]);
      // rect(
      //   this.x + x*this.size,
      //   this.y + y*this.size,
      //   this.size,
      //   this.size
      // );
    }
    this.pos += 1
  }

  this.done = () => {
    return this.pos > 255;
  }

}