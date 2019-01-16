//create a synth and connect it to the master output (your speakers)
var synth = new Tone.Synth().toMaster();

var snare = new Tone.NoiseSynth({
  "volume" : -5,
  "envelope" : {
    "attack" : 0.001,
    "decay" : 0.2,
    "sustain" : 0
  },
  "filterEnvelope" : {
    "attack" : 0.001,
    "decay" : 0.1,
    "sustain" : 0
  }
}).toMaster();

var kick = new Tone.MembraneSynth({
  "envelope" : {
    "sustain" : 0,
    "attack" : 0.02,
    "decay" : 0.8
  },
  "octaves" : 10
}).toMaster();

var piano = new Tone.PolySynth(4, Tone.Synth, {
  "volume" : -8,
  "oscillator" : {
    "partials" : [1, 2, 1],
  },
  "portamento" : .05
}).toMaster();

var bass = new Tone.MonoSynth({
  "volume" : -20,
  "envelope" : {
    "attack" : 0.1,
    "decay" : 0.3,
    "release" : 2,
  },
  "filterEnvelope" : {
    "attack" : 0.001,
    "decay" : 0.01,
    "sustain" : 0.5,
    "baseFrequency" : 200,
    "octaves" : 2.6
  }
}).toMaster();


var keys = {
  'C': ["C", "D",  "E",  "F",  "G",  "A",  "B",  "C"],
  'D': ["D", "E",  "F#", "G",  "A",  "B",  "C#", "D"],
  'E': ["E", "F#", "G#", "A",  "B",  "C#", "D#", "E"],
  'F': ["F", "G",  "A",  "Bb", "C",  "D",  "E",  "F"],
  'G': ["G", "A",  "B",  "C",  "D",  "E",  "F#", "G"],
  'A': ["A", "C",  "C#", "D",  "E",  "F#", "G#", "A"],
  'B': ["B", "C#", "D#", "E",  "F#", "G#", "A#", "B"],
}



var pianoPart;
var kickPart;

var playSong = function(city_button, city_obj) {

  let notes = city_obj['notes'];

  $(city_button).on("click", function() {
    var element = $(this);

    if(kickPart) {
      kickPart.stop();
    }

    if(pianoPart) {
      pianoPart.removeAll();
      pianoPart.dispose();
    }

    var bassPart = new Tone.Sequence(function(time, note){
      bass.triggerAttackRelease(note, "16n", time);
    }, notes);
    bassPart.start(0);

    //
    var cChord = [notes[0]];
    var dChord = [notes[1]];
    var gChord = [notes[2]];

    pianoPart = new Tone.Part(function(time, chord) {
      piano.triggerAttackRelease(chord, "16n", time);
    }, [["0:0:2", cChord], ["0:1", cChord], ["0:1:3", dChord], ["0:2:2", cChord], ["0:3", cChord], ["0:3:2", gChord]]);

    pianoPart.loop = true;
    pianoPart.loopEnd = "1m";
    pianoPart.humanize = true;
    pianoPart.start(0);

    //
    var snarePart = new Tone.Loop(function(time){
      snare.triggerAttack(time);
    }, "2n");
    snarePart.start(0);

    //
    kickPart = new Tone.Loop(function(time){
      kick.triggerAttackRelease("C2", "8n", time);
      
      // visualize the kick
      element.closest('.city').find('.kick').addClass("active");
      setTimeout(function(){ element.closest('.city').find('.kick').removeClass("active"); }, 150);
    }, "2n");
    kickPart.start(0);
    
    //
    Tone.Transport.bpm.value = city_obj['bpm'];
    if (city_obj['playing']) {
      Tone.Transport.stop();
      $(this).text("Play");
      city_obj['playing'] = false;
    } else {
      Tone.Transport.start("+0.1");
      synth.triggerAttackRelease();
      setTimeout(function(){
        responsiveVoice.speak(city_obj['words'][1], city_obj['voice']);
      }, 1600);
      city_obj['playing'] = true;
      $(this).text("Stop");
    }
  });
};


var temp_min = 0;
var temp_max = 100;
var octave_min = 2;
var octave_max = 7;
var note_min = 0;
var note_max = 100;

var generateNotes = function(forecast_data, city_obj) {
  
  $.each( forecast_data, function( idx, val ) {
    if(idx < 8) {
      var temp_norm = (val.temp - temp_min) / (temp_max - temp_min);

      var octave = temp_norm * (octave_max - octave_min) + octave_min;
      octave = Math.floor(octave);

      var index = temp_norm * (note_max - note_min) + note_min;
      index = Math.floor(index % 8);

      var note = keys['C'][index] + octave;
      city_obj['notes'].push(note);

      //data_city_notes.push(index);
      city_obj['words'].push(val.description);
    }
  });

  console.log(city_obj['notes']);
}

var LA = {
  'playing': false,
  'notes': [],
  'bpm': 100,
  'voice': "UK English Male",
  'words': [],
};

var NOLA = {
  'playing': false,
  'notes': [],
  'bpm': 85,
  'voice': "UK English Female",
  'words': [],
};

var NYC = {
  'playing': false,
  'notes': [],
  'bpm': 120,
  'voice': "US English Male",
  'words': [],
};

$.getJSON( "data/today.json", function( data ) {

  generateNotes(data[0].forecast, LA);
  generateNotes(data[1].forecast, NOLA);
  generateNotes(data[2].forecast, NYC);

});

playSong('#LA_play', LA);
playSong('#NOLA_play', NOLA);
playSong('#NYC_play', NYC);
