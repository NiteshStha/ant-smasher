const BOX_FRAME = 1000 / 120;
const BOX_WIDTH = 50;
const BOX_HEIGHT = 50;
const BOX_RADIUS = 25;

var boxes = [];

function Container(width, height) {
  this.width = width;
  this.height = height;
  this.element = null;

  this.init = function() {
    this.element = document.createElement('div');
    this.element.setAttribute('class', 'box-container');
    this.element.setAttribute('id', 'container');
    document.body.appendChild(this.element);
    return this;
  };

  this.setStyle = function() {
    this.element.style.width = this.width + 'px';
    this.element.style.height = this.height + 'px';
    this.element.style.border = '2px solid';
    this.element.style.margin = '0 auto';
    this.element.style.position = 'relative';
  };
}

function Box(x, y, parentElement) {
  this.x = x;
  this.y = y;
  this.moveX = 1;
  this.moveY = 1;
  this.element = null;
  this.parent = parentElement;

  this.init = function() {
    this.element = document.createElement('div');
    this.element.setAttribute('class', 'box');
    parentElement.appendChild(this.element);
    return this;
  };

  this.setStyle = function() {
    this.element.style.width = BOX_WIDTH + 'px';
    this.element.style.height = BOX_HEIGHT + 'px';
    this.element.style.position = 'absolute';
    this.element.style.borderRadius = BOX_RADIUS + 'px';
    var parent = document.getElementById('container');
    this.element.onclick = function(event) {
      var targetValue = event.target;
      parent.removeChild(targetValue);
    };
  };

  this.draw = function() {
    this.element.style.top = this.y + 'px';
    this.element.style.left = this.x + 'px';
  };

  this.move = function() {
    this.x += this.moveX;
    this.y += this.moveY;
  };

  this.checkContainer = function(width, height) {
    if (this.x <= 0 || this.x >= width - BOX_WIDTH) {
      this.moveX = -this.moveX;
    } else if (this.y <= 0 || this.y >= height - BOX_HEIGHT) {
      this.moveY = -this.moveY;
    }
  };

  this.collisionDetection = function(circle, index) {
    for (var i = 0; i < boxes.length; i++) {
      if (circle != boxes[i]) {
        var dx = circle.x + BOX_RADIUS - (boxes[i].x + BOX_RADIUS);
        var dy = circle.y + BOX_RADIUS - (boxes[i].y + BOX_RADIUS);
        var distance = Math.sqrt(dx * dx + dy * dy);
        if (distance <= BOX_RADIUS + BOX_RADIUS) {
          if (dx <= BOX_RADIUS + BOX_RADIUS) {
            circle.moveX = -this.moveX;
            boxes[i].moveX = -this.moveX;
          }
          if (dy <= BOX_RADIUS + BOX_RADIUS) {
            circle.moveY = -this.moveY;
            boxes[i].moveY = -this.moveY;
          }
        }
      }
    }
  };
}

function GameAnimation(parentElement) {
  this.parentElement = parentElement;
  this.init = function() {
    for (var i = 0; i < 20; i++) {
      var box = new Box(
        getRandomValue(0, conwidth - BOX_WIDTH),
        getRandomValue(0, conheight - BOX_HEIGHT),
        this.parentElement
      );
      boxes.push(box);
      box.init();
      box.setStyle();
      box.draw();
    }
    setInterval(this.animate.bind(this), BOX_FRAME);
  };

  this.animate = function() {
    for (var i = 0; i < boxes.length; i++) {
      var box = boxes[i];
      box.move();
      box.draw();
      box.checkContainer(conwidth, conheight);
      box.collisionDetection(box, i);
    }
  };
}

function getRandomValue(min, max) {
  return Math.random() * (max - min) + min;
}

var newContainer = new Container(1500, 700).init();
newContainer.setStyle(newContainer.element);
const conwidth = newContainer.width;
const conheight = newContainer.height;
var gameStart = new GameAnimation(newContainer.element);
gameStart.init();
