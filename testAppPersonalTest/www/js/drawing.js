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
  prevDrawSteps = [], // Array storing old versions of the canvas for undo feature
  numNotesInLine = [], // Array storing how many notes (in lines) were in each drawn line for undo feature
  linesInLastStroke = 1, // Variable to hold the number of notes in the most recent line drawn
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
      pushDrawStep();
      numNotesInLine.push(linesInLastStroke);
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

// Clears the canvas, and all history associated with the canvas (lines, notes, etc.)
function clearHistory() {
  lines = [];
  prevDrawSteps = [];
  numNotesInLine = [];
  linesInLastStroke = 1;
  ctx.clearRect(0, 0, w, h);
  currentColor = "black";
}

// Undo the most recent line drawn
function undo() {
  // Don't undo if canvas is already empty
  if (canvasIsEmpty()) return;

  // Remove removes most lines from last stroke in lines array
  var numLinesToRemove = numNotesInLine.pop();
  lines.splice(-numLinesToRemove, numLinesToRemove);

  // Removes graphic lines on the canvas
  prevDrawSteps.pop();  // Most recent element is what is currently shown so get rid of it
  var canvasPic = new Image();
  canvasPic.src = prevDrawSteps[prevDrawSteps.length - 1];  // Get last line version of the canvas in the array
  ctx.clearRect(0, 0, w, h);  // Reset the canvas, then add the last version
  canvasPic.onload = function () {
    ctx.drawImage(canvasPic, 0, 0);
  };

  if (canvasIsEmpty()) {
    clearHistory();
  }
}

function loadImage(){
  var canvasPic = new Image();
  canvasPic.src = prevDrawSteps[prevDrawSteps.length - 1];  // Get last line version of the canvas in the array
  ctx.clearRect(0, 0, w, h);  // Reset the canvas, then add the last version
  canvasPic.onload = function () {
    ctx.drawImage(canvasPic, 0, 0);
  };
}

// Pushes current canvas to the prevDrawSteps (so we can later undo lines)
function pushDrawStep() {
  prevDrawSteps.push(document.getElementById('canvas').toDataURL());
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
  //var canvas = document.getElementById('canvas');
  return canvas.toDataURL("drawing/png");
}

// Returns true if there are no lines on the canvas
function canvasIsEmpty() {
  return lines.length == 0;
}
