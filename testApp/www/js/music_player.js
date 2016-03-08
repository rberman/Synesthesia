//Everything here is untested

//lines = []; //The lines that we will turn to notes
notes = [];
octaves = ['6', '5', '4'];
key = ['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A'];
noteDivider = 100.0/key.length;
octaveDivider = 100.0/octaves.length;


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
  var duration = line.lineLength / 50.0;
  if (duration < 0.1) {
    duration = 0.1;
  }
	return duration;
}

function lineToNote(line){
	var notePitch = getNotePitch(line);
	var noteLength = getNoteLength(line);

	var note = {
		pitch: notePitch,
		length: noteLength
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
	compileNotes(lines); //TODO: this line for beta only. Will recompile notes every time you start the song.
	playSong(0);
}

function playSong(noteIndex){
	//seconds for notes, but must convert to milliseconds for pause
	var notePitch = notes[noteIndex].pitch;
	var noteLength = notes[noteIndex].length;
	var pause = noteLength*1000;

	//line below for testing
	var note = getNote('sine', notePitch,0.0,0.0,0.9,noteLength,0.0);
	note.play();
	noteIndex++;
	if(noteIndex < notes.length){
		setTimeout(playSong, pause, noteIndex);
	}
	else{
		//clears the notes when the song is over
		notes = [];
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
