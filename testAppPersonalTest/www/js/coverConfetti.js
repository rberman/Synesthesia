//Adapted from a codepen on https://davidwalsh.name/ blog.

var utils = {
  norm: function (value, min, max) {
    return (value - min) / (max - min);
  },

  lerp: function (norm, min, max) {
    return (max - min) * norm + min;
  },

  map: function (value, sourceMin, sourceMax, destMin, destMax) {
    return utils.lerp(utils.norm(value, sourceMin, sourceMax), destMin, destMax);
  },

  distance: function (p0, p1) {
    var dx = p1.x - p0.x,
      dy = p1.y - p0.y;
    return Math.sqrt(dx * dx + dy * dy);
  },

  degreesToRads: function (degrees) {
    return degrees / 180 * Math.PI;
  },

  randomRange: function (min, max) {
    return min + Math.random() * (max - min);
  },

  randomInt: function (min, max) {
    return Math.floor(min + Math.random() * (max - min + 1));
  }

};

var coverCanvas, coverContext, W, H, generator1,
  gravity = parseFloat(0.1),
  wind = 0,
  friction = 0.99;

function coverCanvasInit() {
  coverCanvas = document.getElementById("coverCanvas");
  W = coverCanvas.width = window.innerWidth * 0.8;
  H = coverCanvas.height = window.innerHeight * 1.2;
  coverContext = coverCanvas.getContext("2d");
}

colors = [
  '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
  '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50',
  '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800',
  '#FF5722', '#795548'
];

//
// Add the Generator Here :)
//

generator1 = new particleGenerator(0, 0, W, 0, 200);


function randomInt(min, max) {
  return min + Math.random() * (max - min);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, Math.min(min, max)), Math.max(min, max));
}

function particle(x, y) {
  this.radius = randomInt(.1, 1);
  this.x = x;
  this.y = y;
  this.vx = randomInt(-5, 5);
  this.vy = randomInt(-10, 0);
  this.type = utils.randomInt(0, 1);

  this.w = utils.randomRange(5, 20);
  this.h = utils.randomRange(5, 20);

  this.r = utils.randomRange(5, 10);

  this.angle = utils.degreesToRads(randomInt(0, 360));
  this.anglespin = randomInt(-0.2, 0.2);
  this.color = colors[Math.floor(Math.random() * colors.length)];

  this.rotateY = randomInt(0, 1);
}

particle.prototype.update = function () {
  this.x += this.vx;
  this.y += this.vy;
  this.vy += gravity;
  this.vx += wind;
  this.vx *= friction;
  this.vy *= friction;
  this.radius -= .02;

  if (this.rotateY < 1) {
    this.rotateY += 0.1;

  } else {
    this.rotateY = -1;

  }
  this.angle += this.anglespin;

  coverContext.save();
  coverContext.translate(this.x, this.y);
  coverContext.rotate(this.angle);

  coverContext.scale(1, this.rotateY);

  coverContext.rotate(this.angle);
  coverContext.beginPath();
  coverContext.fillStyle = this.color;
  coverContext.strokeStyle = this.color;
  coverContext.lineCap = "round";
  coverContext.lineWidth = 2;

  if (this.type === 0) {
    coverContext.beginPath();
    coverContext.arc(0, 0, this.r, 0, 2 * Math.PI);
    coverContext.fill();
  } else if (this.type === 2) {
    coverContext.beginPath();
    for (i = 0; i < 22; i++) {
      angle = 0.5 * i;
      x = (.2 + 1.5 * angle) * Math.cos(angle);
      y = (.2 + 1.5 * angle) * Math.sin(angle);

      coverContext.lineTo(x, y);
    }
    coverContext.stroke();

  } else if (this.type === 1) {
    coverContext.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
  }

  coverContext.closePath();
  coverContext.restore();
};

function particleGenerator(x, y, w, h, number, text) {
  // particle will spawn in this area
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.number = number;
  this.particles = [];
  this.text = text;
  this.recycle = true;

  this.type = 1;
}

particleGenerator.prototype.animate = function () {

  coverContext.fillStyle = "grey";

  coverContext.beginPath();
  coverContext.strokeRect(this.x, this.y, this.w, this.h);

  coverContext.font = "13px arial";
  coverContext.textAlign = "center";

  coverContext.closePath();

  if (this.particles.length < this.number) {
    this.particles.push(new particle(clamp(randomInt(this.x, this.w + this.x), this.x, this.w + this.x),

      clamp(randomInt(this.y, this.h + this.y), this.y, this.h + this.y), this.text));
  }

  if (this.particles.length > this.number) {
    this.particles.length = this.number;
  }

  for (var i = 0; i < this.particles.length; i++) {
    var p = this.particles[i];
    p.update();
    if (p.y > H || p.y < -100 || p.x > W + 100 || p.x < -100 && this.recycle) {
      //a brand new particle replacing the dead one
      this.particles[i] = new particle(clamp(randomInt(this.x, this.w + this.x), this.x, this.w + this.x),

        clamp(randomInt(this.y, this.h + this.y), this.y, this.h + this.y), this.text);
    }
  }
};


function toggleEngine() {
  if (generator1.type === 0) {
    generator1.type = 1;
    generator1.x = W / 2;
    generator1.y = H / 2;
    generator1.w = 0;
  }
  else {
    generator1.type = 0;
    generator1.x = 1;
    generator1.w = W;
    generator1.y = 0;
  }
}

function updateConfetti() {
  coverCanvasInit();
  toggleEngine();

  coverContext.fillStyle = "white";
  coverContext.clearRect(0, 0, W, H);
  generator1.animate();
  requestAnimationFrame(updateConfetti);
}
