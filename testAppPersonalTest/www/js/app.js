// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngStorage'])

.factory ('StorageService', function ($localStorage) {

  $localStorage = $localStorage.$default({
    creations: []
  });

  //TODO: change the parameter to the creation name
  var _get = function (creationName) {
    //TODO: Just for testing. Soon look for ID
    for(creationIndex in $localStorage.creations){
      //returns the creation whose name matches creationName
      if($localStorage.creations[creationIndex].name == creationName){
        return $localStorage.creations[creationIndex];
      }
    }
    
    //error
    console.log("Error! " + creationName + " is not a creation.");
  };

  var _getAll = function () {
    console.log("Current Creations: " + $localStorage.creations);
    return $localStorage.creations;
  };

  var _add = function (creation) {
    $localStorage.creations.push(creation);
    console.log("Creation Saved to Local Storage");
    // console.log("\tCreation Lines: " + creation.lines);
    // console.log("\tCreation IMG URL: " + creation.drawingURL);
  }

  var _remove = function (creation) {
    $localStorage.creations.splice($localStorage.creations.indexOf(creation), 1);
  }

  var _removeAll = function () {
    $localStorage.creations = [];
  }

  return {
    getAll: _getAll,
    get: _get,
    add: _add,
    remove: _remove,
    removeAll: _removeAll
  };
})

.controller( 'MainCtrl', function ($scope, StorageService) {
  //Can use this later, but maybe not necessary to get all?
  $scope.creations = StorageService.getAll();

  //eventually require input
  $scope.get = function(creationName){
    StorageService.get(creationName);
  }

  $scope.remove = function (thing) {
    StorageService.remove(thing);
  }

})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $ionicConfigProvider
    .views.swipeBackEnabled(false);

  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.cover', {
    url: '/cover',
    views: {
      'tab-cover': {
        templateUrl: 'templates/tab-cover.html',
        controller: 'coverCtrl'
      }
    }
  })

  .state('tab.drawing', {
      url: '/drawing',
      views: {
        'tab-cover': {
          templateUrl: 'templates/tab-drawing.html',
          controller: 'canvasController'
        }
      }
    })

  .state('tab.result', {
    url: '/result',
    views: {
      'tab-cover': {
        templateUrl: 'templates/tab-result.html',
        controller: 'resultCtrl'
      }
    }
  })

  .state('tab.info', {
    url: '/info',
    views: {
      'tab-cover': {
        templateUrl: 'templates/tab-info.html',

      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/cover');

});
