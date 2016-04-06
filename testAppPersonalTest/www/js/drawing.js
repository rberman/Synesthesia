/**
 * Created by rberman on 2/28/16.
 * CITATIONS:
 * A large part of this code is from http://stackoverflow.com/questions/2368784/draw-on-html5-canvas-using-a-mouse
 * Undo functionality is from http://www.codicode.com/art/undo_and_redo_to_the_html5_canvas.aspx
 */

var canvas, ctx, flag = false,
  prevX = 0,
  currX = 0,
  prevY = 0,
  currY = 0,
  dot_flag = false,
  lines = [],
  linesInLastStroke = 0,
  cPushArray = [], //Array storing old canvases for undo feature
  lineStep = -1,
  maxLineDistance = 50, //This can be experimented with
  currentColor = "black",
  lineSize = 2,
  startX = 0,
  startY = 0,
  distance = 0;

// Method to set up canvas size and add event listeners for drawing
function canvasInit() {
  canvas = document.getElementById('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx = canvas.getContext("2d");
  w = canvas.width;
  h = canvas.height;
  linePush();
}



// Set the color of the pen
function changeColor(newColor) {
  currentColor = newColor;
}


// Draw function creates lines on canvas based on drawing
function draw() {
  ctx.beginPath();
  ctx.moveTo(prevX, prevY);
  ctx.lineTo(currX, currY);
  ctx.strokeStyle = currentColor;
  ctx.lineWidth = lineSize;
  ctx.lineJoin = "round";
  ctx.stroke();
  ctx.closePath();
}


function findxy(mouseAction, e) {
  // When the mouse is pushed
  if (mouseAction == 'down') {
    prevX = currX;
    prevY = currY;
    currX = e.gesture.center.pageX - canvas.offsetLeft;
    currY = e.gesture.center.pageY - canvas.offsetTop;
    linesInLastStroke = 1;

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
    if(flag == true){
      flag = false;
      createLineObj();
      linePush();
    }
  }

  // When mouse is moving
  if (mouseAction == 'move') {
    if (flag) {
      prevX = currX;
      prevY = currY;
      currX = e.gesture.center.pageX - canvas.offsetLeft;
      currY = e.gesture.center.pageY - canvas.offsetTop;
      draw();
      distance ++;
    }

    //starts a new note when the user draws too long of a line
    if(distance >= maxLineDistance){
      createLineObj();
      startX = currX;
      startY = currY;
      distance = 0;
      linesInLastStroke++;
    }
  }
}

// Erase entire canvas
function clearCanvas() {
  ctx.clearRect(0, 0, w, h);
  lines = [];
  cPushArray = [];
}

// Undo the most recent line drawn
function undo() {
  // Don't undo if canvas is already empty
  if (canvasIsEmpty()) return;

  // Remove removes most lines from last stroke in lines array
  if (lines.length >= linesInLastStroke){
    lines.splice(-linesInLastStroke, linesInLastStroke);
  }

  // Removes graphic lines on the canvas
  if (lineStep > 0) {
    lineStep--;
    var canvasPic = new Image();
    canvasPic.src = cPushArray[lineStep];
    ctx.clearRect(0, 0, w, h);
    canvasPic.onload = function () {
      ctx.drawImage(canvasPic, 0, 0);
    }
  }

  // If this undo empties canvas, then reset drawing context
  if (canvasIsEmpty()) {
    cPushArray = [];
  }
}

// Pushes current canvas to the cPushArray (so we can later undo lines)
function linePush() {
  lineStep++;
  if (lineStep < cPushArray.length) { cPushArray.length = lineStep; }
  cPushArray.push(document.getElementById('canvas').toDataURL());
}


// Creates a line object for each line and adds it to the list of lines
function createLineObj(){
  // Create a line object and add it to the lines list
  var line = {
    start: [(startX / canvas.width) * 100.0, (startY / canvas.height) * 100.0],
    lineLength: distance
  };
  lines.push(line);
}

// Saves the drawing so we can display it on the next page
// From: http://stackoverflow.com/questions/3318565/any-way-to-clone-html5-canvas-element-with-its-content
function drawingToResults() {
  //create a new canvas
  var canvas = document.getElementById('canvas');
  var canvasImg = canvas.toDataURL("drawing/png");
  return canvasImg;
}

// Returns true if there are no lines on the canvas
function canvasIsEmpty() {
  return lines.length == 0;
}
