
# Synesthesia: Let's draw music!

## What is Synesthesia?

In today's fast-paced world, we aim to inspire people's creativity by making music in an easy and playful environment. Synesthesia is an ios mobile application where people can draw any image on a blank canvas and turn their visual masterpiece into fun and surprising music. 

## Installation 

Synesthesia is created using the [Ionic framework.](http://ionicframework.com/) Ionic apps can be developed using any operating system but in order to build and deploy it on an iPhone, Mac OS X is necessary.  

###Install Cordova

First, install [Node.js](https://nodejs.org/en/), then open the termminal or command line and run:

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
$git clone https://github.com/rberman/Synesthesia/tree/master/testAppPersonalTest synesthesia
```

###Configure platforms

Note that if you are not installing in a OS X system, do not add the ios platform. 

```bash
$ionic platform add ios
$ionic platform add android 
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

Open XCode
Open existing project --> Synesthesia/www/platforms/ios
Change the Bundle Identifier to com.ionicframework.testapp161830
If you don't already have a Team, link your team to your app.
Go to Product --> Destination --> and Select your Device
Hit the Play Button to run your App on your Phone. NOTE: You will have to allow access to your phone and also if your phone is locked, you will have to unlock it to run. 
