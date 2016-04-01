notes = [];
octaves = ['6', '5', '4'];
key = ['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A'];
noteDivider = 100.0/key.length;
octaveDivider = 100.0/octaves.length;
octaveVolumes = {
	'6' : 0.05,
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
	var pitch = key[noteIndex];
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
	}
}

function playSong(noteIndex){
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
		//clears the notes when the song is over
		notes = [];
		musicPlaying = false;
	}
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
