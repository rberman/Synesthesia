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
    maxLineDistance = 50, //This can be experimented with
    currentColor = "red",
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
    if(flag == true){
      flag = false;
      createLineObj();
    }
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

    //starts a new note when the user draws too long of a line
    if(distance >= maxLineDistance){
      console.log("Line exceeded " + distance);
      createLineObj();
      startX = currX;
      startY = currY;
      distance = 0;
    }
  }
}

// Creates a line object for each line and adds it to the list of lines
function createLineObj(){
   // Create a line object and add it to the lines list
    var line = {
      start: [(startX / canvas.width) * 100.0, (startY / canvas.height) * 100.0],
      lineLength: distance
    };
    lines.push(line);
    console.log(distance);
}

// Saves the drawing so we can display it on the next page
// From: http://stackoverflow.com/questions/3318565/any-way-to-clone-html5-canvas-element-with-its-content
function drawingToResults() {
  //create a new canvas
  var newCanvas = document.getElementById('drawing-pic');
  var context = newCanvas.getContext('2d');

  //set dimensions
  newCanvas.width = canvas.width;
  newCanvas.height = canvas.height * 0.8;

  //apply the old canvas to the new one
  context.drawImage(canvas, 0, 0);
}
