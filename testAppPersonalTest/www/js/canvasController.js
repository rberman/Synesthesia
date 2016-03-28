angular.module('canvasApp.controllers', [])
.controller('canvasController', function($scope, $event){
	 $scope.findxy = function (mouseAction, e) {
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
});