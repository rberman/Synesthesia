angular.module('starter.controllers', ['ionic', 'ngStorage'])

  .controller('coverCtrl', function($scope) {

    // Controller to create confetti
    $scope.createConfetti = function(){
      updateConfetti();
    };

    // Play music on cover page
    //TODO: fix this. Preliminary test that music can start and stop
    $scope.coverMusic = function(){
      ion.sound.play("testSound", {loop:true});
    };

    $scope.stopCoverMusic = function(){
      ion.sound.stop("testSound");
    };

    // Reset canvas
    $scope.resetCanvas = function() {
      clearHistory();
    }
  })

  .controller('resultCtrl', function($scope, StorageService, $ionicPopup, $ionicHistory, $rootScope) {
    $scope.musicPlayingControl;
    $scope.canvasImgURL;

    /** 
    * Cite https://coderwall.com/p/ngisma/safe-apply-in-angular-js
    * This function triggers a digest only if a digest is not already in progress
    * The purpose of this function is to help integrate angular and non-angular code
    */
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

    /**
    * Called when the replay button is clicked
    * Stops music if music is playing, plays music if music is stopped
    */
    $scope.handleReplayButton = function(){
      console.log($scope.musicPlayingControl);
      if($scope.musicPlayingControl){
        $scope.stopMusic();
      }
      else{
        $scope.convertToMusic();
      }
    };

    /**
    * Adds functionality to the back button to stop any playing music
    */
    $rootScope.$ionicGoBack = function() {
      if($scope.musicPlayingControl){
        $scope.stopMusic();
      }
      $ionicHistory.goBack();
    };

    /**
    * Stops music
    */
    $scope.stopMusic = function(){
      stopMusic();
    };

    /**
    * Begins the conversion of drawing to music
    */
    $scope.convertToMusic = function(){
      $scope.musicPlayingControl = true;
      startSong(lines);
      console.log(lines);
    };

    // Save current drawing so it can be returned to
    $scope.transferDrawing = function() {
      $scope.canvasImgURL = drawingToResults();
    };

    // Popup for saving a drawing: gets the name to save it under
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
    };

    $scope.saveCreationToLocalStorage = function(creationName){
      $scope.creation = {
          name: creationName,
          drawingLines: lines,
          drawingSteps: prevDrawSteps,
          notesInLine: numNotesInLine
          // drawingCtx : ctx
      };
        console.log("Lines: " + $scope.creation.drawingLines);

      if(StorageService.add($scope.creation) == -1){ //should save if the name doesn't already exist
        var trashPopup = $ionicPopup.show({
          title: $scope.creation.name +' already exists. Do you want to overwrite it?',
          scope: $scope,
          buttons: [
            { text: 'Cancel' },
            {
              text: '<b>Overwrite</b>',
              type: 'button-assertive',
              onTap: function(e) {
                StorageService.overwrite($scope.creation);
              }
            }
          ]
        });
      }

    };

    $scope.setMusicPlayingControl = function(){
      $scope.musicPlayingControl = musicPlaying;
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
    // Receives any mouse/touch interactions and passes them to the method that draws in drawing.js
    $scope.callCanvasForEvent = function(mouseAction, e){
      //transfers control over to drawing.js in hopes of fixing canvas problem.
      findxy(mouseAction, e);
    };

    // Initiate canvas
    $scope.initCanvas = function(){
      canvasInit();
    };

    // Start a song playing when the play button is clicked
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
        title: 'Are You Sure You Want to Delete This Drawing?',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Delete</b>',
            type: 'button-assertive',
            onTap: function(e) {
              clearHistory();
              $scope.hidePlayButton();
              $scope.currentColor = 'black';
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
        $scope.currentColor = 'black';
      }
    };

    // Opens the saved drawings of the user if they exist
    $scope.promptLoadWhichDrawing = function(){
      $scope.userInput = {};
      // If there are no saved drawings, an explanatory popup appears
      if ($scope.getAllCreations().length == 0) {
        var alertPopup = $ionicPopup.alert({
          title: "You don't have any saved drawings!",
          template: 'If you make a drawing that you really like, be sure to save it after you play it, and you can load it here in the future!'
        });
      }
        // If there are loaded drawings, display the loaded drawings and allow people to delete them
      else {
        $scope.loadPopup = $ionicPopup.show({
          // template: '<input type="text" ng-model="userInput.creationName">',
          template: '<ul>' +
          '<li ng-repeat="creation in getAllCreations()">' +
          '<button ng-click="loadCreation(creation.name); closePopup()" class="loadButton button button-calm">{{creation.name}}</button>' +
          '<button ng-click="deleteCreation(creation.name);" class="deleteDrawingButton button button-assertive icon ion-ios-trash"> </button>' +
          '</li>' +
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
    };

    $scope.closePopup = function(){
      $scope.loadPopup.close();
    };

    // Returns all saved drawings
    $scope.getAllCreations = function(){
      return StorageService.getAll();
    };

    // Removes a drawing from the saved drawings
    $scope.deleteCreation = function(creationName){
      var trashPopup = $ionicPopup.show({
        title: 'Are You Sure You Want to Permanently Delete This Drawing?',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Delete</b>',
            type: 'button-assertive',
            onTap: function(e) {
              StorageService.remove(creationName);
            }
          }
        ]
      });
    };

    // Loads the drawing a user selected onto the canvas
    $scope.loadCreation = function(creationName){
      $scope.loadedCreation = StorageService.get(creationName);

      lines = $scope.loadedCreation.drawingLines;
      prevDrawSteps = $scope.loadedCreation.drawingSteps;
      numNotesInLine = $scope.loadedCreation.notesInLine;

      loadImage();

      if(lines.length > 0){
        $scope.canvasIsBlank = false;
      }
      //enable play
      console.log($scope.canvasIsBlank);
      console.log(lines);
      console.log(prevDrawSteps);
      console.log(numNotesInLine);
      // console.log(ctx);
      // alert(JSON.stringify($scope.loadedCreation));
    };

  });
