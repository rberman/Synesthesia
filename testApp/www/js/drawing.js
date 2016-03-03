/**
 * Created by rberman on 2/28/16.
 */

var canvas, ctx, flag = false,
    prevX = 0,
    currX = 0,
    prevY = 0,
    currY = 0,
    dot_flag = false,
    lines = [],
    currentColor = "black",
    lineSize = 2,
    startX = 0,
    startY = 0,
    distance = 0;


// Method to set up canvas size and add event listeners for drawing
function init() {
  canvas = document.getElementById('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx = canvas.getContext("2d");
  w = canvas.width;
  h = canvas.height;

  canvas.addEventListener("mousemove", function (e) {
    findxy('move', e)
  }, false);
  canvas.addEventListener("mousedown", function (e) {
    findxy('down', e)
  }, false);
  canvas.addEventListener("mouseup", function (e) {
    findxy('up', e)
  }, false);
  canvas.addEventListener("mouseout", function (e) {
    findxy('out', e)
  }, false);
}



// Set the color of the pen
function color(obj) {
  switch (obj.id) {
    case "green":
      currentColor = "green";
      break;
    case "blue":
      currentColor = "blue";
      break;
    case "red":
      currentColor = "red";
      break;
    case "yellow":
      currentColor = "yellow";
      break;
    case "orange":
      currentColor = "orange";
      break;
    case "black":
      currentColor = "black";
      break;
    case "white":
      currentColor = "white";
      break;
  }
  if (currentColor == "white") lineSize = 14;
  else lineSize = 2;

}


// Draw function creates lines on canvas based on drawing
function draw() {
  ctx.beginPath();
  ctx.moveTo(prevX, prevY);
  ctx.lineTo(currX, currY);
  ctx.strokeStyle = currentColor;
  ctx.lineWidth = lineSize;
  ctx.stroke();
  ctx.closePath();
}


function findxy(mouseAction, e) {
  // When the mouse is pushed
  if (mouseAction == 'down') {
    prevX = currX;
    prevY = currY;
    currX = e.clientX - canvas.offsetLeft;
    currY = e.clientY - canvas.offsetTop;

    flag = true;
    dot_flag = true;
    if (dot_flag) {
      ctx.beginPath();
      ctx.fillStyle = currentColor;
      ctx.fillRect(currX, currY, 2, 2);
      ctx.closePath();
      dot_flag = false;
    }

    // Remember where the line starts
    startX = currX;
    startY = currY;
    distance = 0;
  }

  // When mouse is lifted
  if (mouseAction == 'up' || mouseAction == "out") {
    flag = false;

    // Create a line object and add it to the lines list
    var line = {
      start: [(startX / canvas.width) * 100.0, (startY / canvas.height) * 100.0],
      lineLength: distance
    };
    lines.push(line);
    console.log(distance);
  }

  // When mouse is moving
  if (mouseAction == 'move') {
    if (flag) {
      prevX = currX;
      prevY = currY;
      currX = e.clientX - canvas.offsetLeft;
      currY = e.clientY - canvas.offsetTop;
      draw();
      distance ++;
    }
  }
}
