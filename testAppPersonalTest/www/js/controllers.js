angular.module('starter.controllers', [])

.controller('coverCtrl', function($scope) {})

.controller('canvasController', function($scope) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.callCanvasForEvent = function(mouseAction, e){
    //transfers control over to drawing.js in hopes of fixing canvas problem.
    findxy(mouseAction, e);
  }

  $scope.initCanvas = function(){
    canvasInit();
  }

  $scope.convertToMusic = function(){
    window.setTimeout(startSong(lines),3000)
    //startSong(lines);
  }
});
