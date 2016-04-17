angular.module('starter.controllers', ['ionic', 'ngStorage'])

  .controller('coverCtrl', function($scope) {
    $scope.createConfetti = function(){
      updateConfetti();
    };

    // Reset canvas
    $scope.resetCanvas = function() {
      clearCanvas();
      $scope.hidePlayButton();
      changeColor('black');
    };
  })

  .controller('resultCtrl', function($scope, StorageService, $ionicPopup) {
    $scope.musicPlayingControl;
    $scope.canvasImgURL;

    //function taken from 'https://coderwall.com/p/ngisma/safe-apply-in-angular-js'
    $scope.safeApply = function(fn) {
      var phase = this.$root.$$phase;
      if(phase == '$apply' || phase == '$digest') {
        if(fn && (typeof(fn) === 'function')) {
          fn();
        }
      } else {
        this.$apply(fn);
      }
    };

    $scope.handleReplayButton = function(){
      if($scope.musicPlayingControl){
        stopMusic();
      }
      else{
        $scope.convertToMusic();
      }
    };

    $scope.convertToMusic = function(){
      $scope.musicPlayingControl = true;
      startSong(lines);
      console.log(lines);
    };

    $scope.saveDrawing = function() {
      $scope.canvasImgURL = drawingToResults();
    };

    $scope.promptNameForCreation = function(){
      //need to do this for ng-model to work in controller
      $scope.userInput = {};
      var myPopup = $ionicPopup.show({
        template: '<input type="text" ng-model="userInput.creationName">',
        title: 'Enter A Name For Your Creation',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.userInput.creationName) {
                //don't allow the user to close unless he enters wifi password
                console.log($scope.userInput.creationName);
                e.preventDefault();
              } else {
                // return $scope.creationName;
                $scope.saveCreationToLocalStorage($scope.userInput.creationName);
              }
            }
          }
        ]
      });
    }

    $scope.saveCreationToLocalStorage = function(creationName){
      $scope.creation = {
          drawingURL: $scope.canvasImgURL,
          drawingLines: lines,
          name: creationName
      };
        console.log("Lines: " + $scope.creation.drawingLines);
        $scope.add($scope.creation);
    };

    $scope.setMusicPlayingControl = function(){
      $scope.musicPlayingControl = musicPlaying;
    };

    $scope.add = function(creation){
      StorageService.add(creation);
    };

    $scope.getAll = function(){
      return StorageService.getAll();
    };

    $scope.checkStorage = function(){
      var creationList = $scope.getAll();
      var lastIndex = creationList.length - 1;
      console.log(creationList[lastIndex].name);

      for(var i = 0; i < lastIndex; i++){
        console.log(creationList[i].drawingURL);
      }
    }

  })

  .controller('canvasController', function($scope, StorageService, $ionicPopup) {
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
    };

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
      if (color == "red") return "assertive";
      if (color == "yellow") return "energized";
      if (color == "green") return "balanced";
      if (color == "blue") return "positive";
      if (color == "purple") return "royal";
      if (color == "black") return "dark";
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
      var trashPopup = $ionicPopup.show({
        // template: '<input type="text" ng-model="userInput.creationName">',
        title: 'Are You Sure You Want to Delete This Drawing?',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Delete</b>',
            type: 'button-assertive',
            onTap: function(e) {
              clearCanvas();
              $scope.hidePlayButton();
            }
          }
        ]
      });
    };

    // Undo most recent line
    $scope.undoLast = function() {
      undo();
      if (canvasIsEmpty()) {
        $scope.hidePlayButton();
      }
    };

    $scope.promptLoadWhichDrawing = function(){

      $scope.userInput = {};
      $scope.loadPopup = $ionicPopup.show({
        // template: '<input type="text" ng-model="userInput.creationName">',
        template: '<ul>'+
                      '<li ng-repeat="creation in getAllCreations()" ng-click="loadCreation(creation.name); closePopup()">'+
                      '<div class="loadButton button button-calm"><p>{{creation.name}}</p> <button class="button button-assertive icon ion-ios-trash"></button></div>'+
                      '</li>'+
                    '</ul>',
        title: 'Which Creation Would You Like To Load?',
        scope: $scope,
        buttons: [
          {
            text: 'Cancel', 
            type: 'button-assertive'
          }
        ]
      });

    }

    $scope.closePopup = function(){
      $scope.loadPopup.close();
    }

    $scope.getAllCreations = function(){
      return StorageService.getAll();
    }

    $scope.loadCreation = function(creationName){
      $scope.loadedCreation = StorageService.get(creationName);

      lines = $scope.loadedCreation.drawingLines;

      alert(JSON.stringify($scope.loadedCreation));
      // console.log($scope.loadedCreation.drawingURL);
      // console.log(JSON.stringify(lines));
    }
  });
