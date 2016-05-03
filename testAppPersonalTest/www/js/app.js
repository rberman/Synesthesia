// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
  console.log("-------> it is ready", cordova.file);
}

angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngStorage', 'lokijs'])

  .factory ('StorageService', function ($localStorage) {

    /**Initiate database 'savedDrawings' with collection 'drawings' and a dynamic view of the names*/
    var db, drawings;
    ionic.Platform.ready(function(){
      // will execute when device is ready, or immediately if the device is already ready.
      var adapter = new LokiCordovaFSAdapter({"prefix": "loki"});
      db = new loki('loki.json', {
        autosave: true,
        autosaveInterval: 5000,
        autoload: true,
        adapter: adapter
      });
      drawings = db.getCollection('drawings');
      if (!drawings) {
        drawings = db.addCollection('drawings', {
          unique: ['name']
        });
      }
    });



    /**
     * Searches for a creation based on its name and returns it if it exists, prints an error if it does not
     */
    var _get = function (creationName) {
      //return drawings.find({ 'name': creationName });
      var foo =  drawings.by('name', creationName);
      return foo;
    };

    /** TODO
     * Returns all saved creations
     */
    var _getAll = function () {
      return drawings.data;
    };

    /**
     * Adds a creation if one of the same name does not exist
     * Returns -1 if one of the same name does exist
     */
    var _add = function (creation) {
      if(_get(creation.name) != null){
        return -1;
      }

      drawings.insert({
        name: creation.name,
        drawingLines: creation.drawingLines,
        drawingSteps: creation.drawingSteps,
        notesInLine: creation.notesInLine
      });

      db.saveDatabase();
    };

    /**
     * Overwrites a creation by removing and then adding
     */
    var _overwrite = function(creation){
      _remove(creation.name);
      _add(creation);
    };

    /**
     * Searches for a creation based on name and removes it
     */
    var _remove = function (creationName) {
      var drawingToRemove = _get(creationName);
      drawings.remove( drawingToRemove );
    };

    /**
     * Deletes all saved creations
     */
    var _removeAll = function () {
      drawings.removeDataOnly();
    };

    /**
     * These are the function names that can be called by outside functions using StorageService.(function name)
     */
    return {
      getAll: _getAll,
      get: _get,
      add: _add,
      remove: _remove,
      removeAll: _removeAll,
      overwrite: _overwrite
    };
  })

  .controller( 'MainCtrl', function ($scope, StorageService) {
    //Can use this later, but maybe not necessary to get all?
    $scope.creations = StorageService.getAll();

    //eventually require input
    $scope.get = function(creationName){
      StorageService.get(creationName);
    };

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
