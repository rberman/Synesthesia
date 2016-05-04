
# Synesthesia: Let's draw music!

## What is Synesthesia?

In today's fast-paced world, we aim to inspire people's creativity by making music in an easy and playful environment. Synesthesia is an ios mobile application where people can draw any image on a blank canvas and turn their visual masterpiece into fun and surprising music. 

## Installation 

Synesthesia is created using the [Ionic framework.](http://ionicframework.com/) Ionic apps can be developed using any operating system but in order to build and deploy it on an iPhone, Mac OS X is necessary.  

###Install Cordova

First, install [Node.js](https://nodejs.org/en/), then open the terminal or command line and run:

```bash
$sudo npm install -g cordova
```

###Install Ionic

To install ionic, run:

```bash
$sudo npm install -g ionic
```

###Clone the Synesthesia repository 

```bash
$git clone https://github.com/rberman/Synesthesia/tree/master/testAppPersonalTest 
```

###Configure platforms

Note that if you are not installing in a OS X system, do not add the ios platform. 

```bash
$ionic platform add ios
```

##Testing Synesthesia

Now that you have the Synesthesia repository, you can test the application. 

###Desktop browser testing

This is the fastest way to test the application. The browser will automatically reload to show saved changes in the HTML, CSS and JavaScript files. 

```bash
$ionic serve
```

###Simulator testing

To emulate ios (only using OS X):

```bash
$ionic build ios 
$ionic emulate ios 
```

###Native app testing 

This is only availiable in OS X operating system. 

1. Open the existing project directory (Synesthesia/platforms/ios) in XCode. 
2. Change the Bundle Identifier to com.ionicframework.testapp161830. 
3. If you do not already have a team, link your team to your app. 
4. Go to Product -> Destination. Select your Device. 
5. Press play to build and run the app on your phone. 
    * NOTE: Make sure that the phone is unlocked. Also, the computer needs to have access to the phone, that is, the phone has to     trust the computer. 

#Notes

###Branches

The master branch contains the final demo code. As software development never truly ends, there are a few bugs we would like to fix before releasing Synesthesia on the app store. Below are the names and descriptions of the additional branches. 

   * headPhonesFix
      * This branch is working on removing the buzzing that occurs while using headphones. 
   * SynMemoryTesting
      *  Currently there is a storage problem where local memory erases saved creations when the phone needs space. This branch is trying to transfer the memory system to Ionic using Loki.js.   
