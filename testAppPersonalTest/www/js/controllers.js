angular.module('starter.controllers', ['ionic', 'ngStorage'])

  .controller('coverCtrl', function($scope, $rootScope) {
    //The commented out code below is part of our attempt to solve the headphone buzzing. I am not deleting it as it may be helpful in the future
    
        // $rootScope.headsetConnected;
        // $rootScope.$watch(function(){
        //   WadLibContext = new WadLibAudioContext();
        //   plugins.headsetdetection.detect(function(detected) {

        //     if (detected == null){
        //       $rootScope.headsetConnected = detected;
        //     }
            
        //     if (detected != $rootScope.headsetConnected){
        //       //set headsetConnected state to current state
        //       $rootScope.headsetConnected = detected;
        //       alert($rootScope.headsetConnected);
        //       //TODO: find out what I need to do or refresh to get rid of the buzz
        //       //TODO: maybe this:
        //       // $window.location.reload();
        //       alert("replacing js file");
        //       // $rootScope.replacejscssfile("js/wad-master/build/wad.min.js", "js/wad-master/build/wad.min.js", "js");
        //       WadLibContext = new WadLibAudioContext();
        //       alert("js file replaced");
        //       // $window.location.reload();
        //     }

        //     // console.log($rootScope.headsetConnected);
        //   });
        // });


    // Controller to create confetti
    $scope.createConfetti = function(){
      updateConfetti();
    };

    // Reset canvas
    $scope.resetCanvas = function() {
      clearHistory();
    }
  })

  .controller('infoCtrl', function($scope) {

    /**
     * Controllers for opening/closing info tabs
     * @type {boolean}
     */
    $scope.drawingArrowIcon = "ion-chevron-right";
    $scope.hideDraw = true;
    $scope.toggleDraw = function() {
      $scope.hideDraw = !$scope.hideDraw;
      if ($scope.drawingArrowIcon == "ion-chevron-right") {
        $scope.drawingArrowIcon = "ion-chevron-down";
      } else {
        $scope.drawingArrowIcon = "ion-chevron-right";
      }
    };

    $scope.listenArrowIcon = "ion-chevron-right";
    $scope.hideListen = true;
    $scope.toggleListen = function() {
      $scope.hideListen = !$scope.hideListen;
      if ($scope.listenArrowIcon == "ion-chevron-right") {
        $scope.listenArrowIcon = "ion-chevron-down";
      } else {
        $scope.listenArrowIcon = "ion-chevron-right";
      }
    };

    $scope.saveArrowIcon = "ion-chevron-right";
    $scope.hideSave = true;
    $scope.toggleSave = function() {
      $scope.hideSave = !$scope.hideSave;
      if ($scope.saveArrowIcon == "ion-chevron-right") {
        $scope.saveArrowIcon = "ion-chevron-down";
      } else {
        $scope.saveArrowIcon = "ion-chevron-right";
      }
    }
  })

  .controller('resultCtrl', function($scope, StorageService, $ionicPopup, $ionicHistory, $rootScope) {

    //probably unnecessary at this point, but I am keeping this in here for ease of testing
    $scope.testHeadsetDetection = function() {
      alert("test"); 
      // plugins.headsetdetection.detect(function(detected) {alert(detected)});
      // alert($rootScope.headsetConnected);
    };

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

    /**
    * Transfers user's drawing to result page
    */
    $scope.transferDrawing = function() {
      $scope.canvasImgURL = drawingToResults();
    };

    /**
    * Popup for saving a drawing: prompts user for name to save creation under
    */
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
              //don't allow the user to close unless they enter a name
              if (!$scope.userInput.creationName) {
                console.log($scope.userInput.creationName);
                e.preventDefault();
              } else {
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
      };
      console.log("Lines: " + $scope.creation.drawingLines);
      //StorageService.add returns -1 when a drawing of the same name already exists
      if(StorageService.add($scope.creation) == -1){ //saves if the name doesn't already exist
        //Asks user if they want to overwrite previously saved creation
        var overwritePopup = $ionicPopup.show({
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

    /**
    * Called to set the scope value of musicPlayingControl to that of the global, non-scope of musicPlaying
    */
    $scope.setMusicPlayingControl = function(){
      $scope.musicPlayingControl = musicPlaying;
    };

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

    // Clears canvas after checking with user
    $scope.trash = function() {
      var trashPopup = $ionicPopup.show({
        title: 'Are You Sure You Want to Create A New Drawing?',
        template: '<p style="text-align: center">Any unsaved work will be lost</p>',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Yes</b>',
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
          template:
          '<ul>' +
            '<li ng-repeat="creation in getAllCreations()">' +
              '<div>'+
                '<button ng-click="loadCreation(creation.name); closePopup(loadPopup)" class="loadButton button button-calm">{{creation.name}}</button>' +
                '<button ng-click="deleteCreation(creation.name);" class="deleteDrawingButton button button-assertive icon ion-ios-trash"> </button>' +
              '</div>'+
            '</li>' +
          '</ul>' +
          '<p ng-if="getAllCreations().length == 0" style="text-align: center"> You have no saved Creations </p>',
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

    //can pass in any popup to close it in response to an event
    $scope.closePopup = function(popup){
      popup.close();
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

    };
  });
