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

var keys = {
  'C': ["C", "D", "E", "F", "G", "A", "B", "C"]
}

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


var LA_notes = [];
var LA_words = [];
var NOLA_notes = [];
var NOLA_words = [];
var NYC_notes = [];
var NYC_words = [];


var temp_min = 0;
var temp_max = 100;
var octave_min = 2;
var octave_max = 7;
var note_min = 0;
var note_max = 100;

var generateNotes = function(key, val, data_city_notes, data_city_words) {
  if(key < 8) {
    var temp_norm = (val.temp - temp_min) / (temp_max - temp_min);

    var octave = temp_norm * (octave_max - octave_min) + octave_min;
    octave = Math.floor(octave);

    var index = temp_norm * (note_max - note_min) + note_min;
    index = Math.floor(index % 8);

    var note = keys['C'][index] + octave;
    data_city_notes.push(note);

    data_city_notes.push(index);
    data_city_words.push(val.description);
  }
}

$.getJSON( "data/today.json", function( data ) {
  var str = "";

	$.each( data[0].forecast, function( key, val ) {
    generateNotes(key, val, LA_notes, LA_words);
	});
  console.log(LA_notes);

  $.each( data[1].forecast, function( key, val ) {
    generateNotes(key, val, NOLA_notes, NOLA_words);
  });
  console.log(NOLA_notes);

  $.each( data[2].forecast, function( key, val ) {
    generateNotes(key, val, NYC_notes, NYC_words);
  });
  console.log(NYC_notes);

});

var pianoPart;
var kickPart;

var playSong = function(city_button, city_notes, city_bpm, city_playing, city_words, city_voice) {

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
    }, city_notes);
    bassPart.start(0);

    //
    var cChord = [city_notes[0]];
    var dChord = [city_notes[1]];
    var gChord = [city_notes[2]];

    pianoPart = new Tone.Part(function(time, chord) {
      piano.triggerAttackRelease(chord, "16n", time);
    }, [["0:0:2", cChord], ["0:1", cChord], ["0:1:3", dChord], ["0:2:2", cChord], ["0:3", cChord], ["0:3:2", gChord]]);

    pianoPart.loop = true;
    pianoPart.loopEnd = "1m";
    pianoPart.humanize = true;
    pianoPart.start(0);
    //

    //
    var snarePart = new Tone.Loop(function(time){
      snare.triggerAttack(time);
    }, "2n");
    snarePart.start(0);
    //

    //
    kickPart = new Tone.Loop(function(time){
      console.log(element);
      kick.triggerAttackRelease("C2", "8n", time);
      element.closest('.city').find('.kick').addClass("active");
      setTimeout(function(){ element.closest('.city').find('.kick').removeClass("active"); }, 150);
    }, "2n");
    kickPart.start(0);
    //

    Tone.Transport.bpm.value = city_bpm;
    if (city_playing) {
      Tone.Transport.stop();
      $(this).text("Play");
      city_playing = false;
    } else {
      Tone.Transport.start("+0.1");
      synth.triggerAttackRelease();
      setTimeout(function(){
        responsiveVoice.speak(city_words[1], city_voice);
      }, 1600);
      city_playing = true;
      $(this).text("Stop");
    }
  });
};

var LA_playing = false;
var NOLA_playing = false;
var NYC_playing = false;

playSong('#LA_play', LA_notes, 100, LA_playing, LA_words,"UK English Male");
playSong('#NOLA_play', NOLA_notes, 85, NOLA_playing, NOLA_words,"French Female");
playSong('#NYC_play', NYC_notes, 120, NYC_playing, NYC_words,"Japanese Male");
