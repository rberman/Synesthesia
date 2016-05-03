notes = [];
octaves = ['6', '5', '4'];
keys = {"black":['C', 'Eb', 'F', 'Gb', 'G', 'Bb'], //C Blues scale
		"purple": ['C', 'D', 'Eb', 'F', 'G', 'Ab', 'Bb'], //C Minor scale
		"blue": ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'], //F Major scale
		"green": ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'], //E Major scale
		"yellow": ['C', 'D', 'E', 'F', 'G', 'A', 'B'], //C Major scale
		"red": ['Ab', 'Bb', 'Cb', 'Db', 'Eb', 'Fb', 'Gb']}; //A Flat Major scale
currentKey = [];
noteDivider = 100.0/currentKey.length;
octaveDivider = 100.0/octaves.length;
octaveVolumes = {
	'6' : 0.2,
	'5' : 0.8,
	'4' : 1.0
}
musicPlaying = false;


/** Returns a note, a String following the format of
* Wad.js, containing both tone and octave
* the argument is a line object
**/
function getNotePitch(line){
	var startX = line.start[0];
	var startY = line.start[1];

	//find the note
	var noteIndex = Math.floor(startX/noteDivider);
	var pitch = currentKey[noteIndex];
	//find the octave
	var octaveIndex = Math.floor(startY/octaveDivider);
	pitch = pitch.concat(octaves[octaveIndex]);

	return pitch;
}

function getNoteLength(line){
  var duration = line.lineLength / 60.0;
  if (duration < 0.1) {
    duration = 0.1;
  }
	return duration;
}

function getNoteVolume(line){
	var startY = line.start[1];

	var octaveIndex = Math.floor(startY/octaveDivider);
	var octave = octaves[octaveIndex];
	var volume = octaveVolumes[octave];

	return volume;
}

function lineToNote(line){
	var notePitch = getNotePitch(line);
	var noteLength = getNoteLength(line);
	var noteVolume = getNoteVolume(line);

	var note = {
		pitch: notePitch,
		length: noteLength,
		volume: noteVolume
	};

	return note;
}


function compileNotes(lines){
	var count = 0;
	var color = "";
	var colorCount = {};
	for (line in lines){
		var lineColor = lines[line].color;
		if (colorCount[lineColor] == null){
			colorCount[lineColor] = 0;
		}
		colorCount[lineColor] += lines[line].lineLength;
		if (colorCount[lineColor] > count){
			count = colorCount[lineColor]
			color = lineColor
		}
	}
	currentKey = keys[color];
	console.log("Dominant Color is " + color + " and Current Scale is " + currentKey);
	for(line in lines){
		var note = lineToNote(lines[line]);
		notes.push(note);
	}
}

/**
* plays the song from the notes array
**/
function startSong(lines){
	if(!musicPlaying){
		musicPlaying = true;

		compileNotes(lines); //TODO: this line for beta only. Will recompile notes every time you start the song.
	  	window.setTimeout(1000000); //TODO: fix this so page loads first then plays; quick fix is manual pause so page loads first
		playSong(0);
		// return;
	}
}

function playSong(noteIndex){
	if(musicPlaying){
	//seconds for notes, but must convert to milliseconds for pause
		var notePitch = notes[noteIndex].pitch;
		var noteLength = notes[noteIndex].length;
		var noteVolume = notes[noteIndex].volume;
		var pause = noteLength*1000;

		//TODO: should replace random literal values with variables.
		var note = getNote('sine', notePitch,0.0,0.0,noteVolume,noteLength,0.0);
		note.play();
		console.log("Volume: " + noteVolume);
		noteIndex++;

		if(noteIndex < notes.length){
			setTimeout(playSong, pause, noteIndex);
		}
		else{
			//to ensure that the play button turns to pause only after music is done
			setTimeout(stopMusic, pause);
		}
	}
}

function stopMusic(){
	//maybe think of a better method than clearing notes?
	//when refactoring, could just manipulate noteIndex
	clearNotes();
	musicPlaying = false;

	var angularScope = angular.element(document.getElementById("replay-button")).scope();
	angularScope.safeApply(function(){
		angularScope.$watch('musicPlaying', function(){
			angularScope.setMusicPlayingControl();
		});
	});
}

function getNote(_source,_pitch,_attack,_decay,_sustain,_hold,_release){
	var note = new Wad({
	    source : _source,
	    pitch : _pitch,
	    env : {
	        attack : _attack,
	        decay : _decay,
	        sustain : _sustain,
	        hold : _hold,
	        release : _release
	    }
	});
	return note;
}

// Clears all notes in list
function clearNotes(){
  notes = [];
}
