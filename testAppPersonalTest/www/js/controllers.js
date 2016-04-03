angular.module('starter.controllers', [])

  .controller('coverCtrl', function($scope) {})

  .controller('resultCtrl', function($scope) {
    $scope.canvasImgURL;
    $scope.convertToMusic = function(){
      startSong(lines);
    }

    //save image and put it one results page
    $scope.saveDrawing = function() {
      $scope.canvasImgURL = drawingToResults();
      console.log($scope.canvasImgURL);
    }
  })

  .controller('canvasController', function($scope) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Save image and put it on results page
    // $scope.saveDrawing = function() {
    //   $scope.canvasImgURL = drawingToResults();
    //   //console.log($scope.canvasImgURL);
    // }

    $scope.callCanvasForEvent = function(mouseAction, e){
      //transfers control over to drawing.js in hopes of fixing canvas problem.
      findxy(mouseAction, e);
    };

    $scope.initCanvas = function(){
      canvasInit();
    };

    $scope.convertToMusic = function(){
      startSong(lines);
    }

    //Play button visibility (only if canvas is not blank)
    $scope.canvasIsBlank = true;
    $scope.showPlayButton = function() {
      $scope.canvasIsBlank = false;
    };
    $scope.hidePlayButton = function() {
      $scope.canvasIsBlank = true;
    };

    // COLOR CONTROL BUTTONS
    // Find what class a certain color button is
    $scope.colorToClass = function(color) {
      if (color == "red") return "button-assertive";
      if (color == "yellow") return "button-energized";
      if (color == "green") return "button-balanced";
      if (color == "blue") return "button-positive";
      if (color == "purple") return "button-royal";
      if (color == "black") return "button-dark";
    };

    // Hide/show color buttons
    $scope.hideColors = true;
    $scope.toggleColors = function() {
      $scope.hideColors = !$scope.hideColors;
    };

    // Change the color of the pen and close the color menu
    $scope.currentColor = "black";
    $scope.changeColors = function(color) {
      changeColor(color);
      $scope.toggleColors();
      $scope.currentColor = color;
    };
    // Returns the class for the current color
    $scope.getCurrentColorClass = function() {
      return $scope.colorToClass($scope.currentColor)
    };

    // Clear canvas
    $scope.trash = function() {
      clearCanvas();
      $scope.hidePlayButton();
    }
  });
