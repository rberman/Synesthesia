angular.module('starter.controllers', [])

.controller('coverCtrl', function($scope) {})

.controller('canvasController', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
    $scope.canvas, $scope.ctx, $scope.flag = false,
    $scope.prevX = 0,
    $scope.currX = 0,
    $scope.prevY = 0,
    $scope.currY = 0,
    $scope.dot_flag = false,
    $scope.lines = [],
    $scope.currentColor = "black",
    $scope.lineSize = 2,
    $scope.startX = 0,
    $scope.startY = 0,
    $scope.distance = 0;

  $scope.draw = function() {
    $scope.ctx.beginPath();
    $scope.ctx.moveTo($scope.prevX, $scope.prevY);
    $scope.ctx.lineTo($scope.currX, $scope.currY);
    $scope.ctx.strokeStyle = $scope.currentColor;
    $scope.ctx.lineWidth = $scope.lineSize;
    $scope.ctx.stroke();
    $scope.ctx.closePath();
  }

  $scope.findxy = function (mouseAction, e) {
  // When the mouse is pushed
        $scope.canvas = document.getElementById('canvas');
        $scope.canvas.width = window.innerWidth;
        $scope.canvas.height = window.innerHeight;
        $scope.ctx = $scope.canvas.getContext("2d");
        $scope.w = $scope.canvas.width;
        $scope.h = $scope.canvas.height;

        if (mouseAction == 'down') {
          //alert("TEST");
          $scope.prevX = $scope.currX;
          $scope.prevY = $scope.currY;
          $scope.currX = e.clientX - $scope.canvas.offsetLeft;
          $scope.currY = e.clientY - $scope.canvas.offsetTop;

          $scope.flag = true;
          $scope.dot_flag = true;
          if ($scope.dot_flag) {
            $scope.ctx.beginPath();
            $scope.ctx.fillStyle = $scope.currentColor;
            $scope.ctx.fillRect($scope.currX, $scope.currY, 2, 2);
            $scope.ctx.closePath();
            $scope.dot_flag = false;
          }

          // Remember where the line starts
          $scope.startX = $scope.currX;
          $scope.startY = $scope.currY;
          $scope.distance = 0;
        }

        // When mouse is lifted
        if (mouseAction == 'up' || mouseAction == "out") {

          if($scope.flag == true){
            $scope.flag = false;
            // Create a line object and add it to the lines list
            $scope.line = {
              start: [($scope.startX / $scope.canvas.width) * 100.0, ($scope.startY / $scope.canvas.height) * 100.0],
              lineLength: $scope.distance
            };
            $scope.lines.push($scope.line);
            console.log($scope.distance);
          }
        }

        // When mouse is moving
        if (mouseAction == 'move') {
          if ($scope.flag) {
            $scope.prevX = $scope.currX;
            $scope.prevY = $scope.currY;
            $scope.currX = e.clientX - $scope.canvas.offsetLeft;
            $scope.currY = e.clientY - $scope.canvas.offsetTop;
            $scope.draw();
            $scope.distance ++;
          }
        }
      }

      $scope.color = function(obj){
        switch (obj.id) {
          case "green":
            $scope.currentColor = "green";
            break;
          case "blue":
            $scope.currentColor = "blue";
            break;
          case "red":
            $scope.currentColor = "red";
            break;
          case "yellow":
            $scope.currentColor = "yellow";
            break;
          case "orange":
            $scope.currentColor = "orange";
            break;
          case "black":
            $scope.currentColor = "black";
            break;
          case "white":
            $scope.currentColor = "white";
            break;
        }
        if ($scope.currentColor == "white") $scope.lineSize = 14;
        else $scope.lineSize = 2;
      }

      $scope.convertToMusic = function(){
        startSong($scope.lines);
      }
})

.controller('resultCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});