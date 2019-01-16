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

var key_c = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"];

// /*
//  KICK
//  */
// var kick = new Tone.MembraneSynth({
//   "envelope" : {
//     "sustain" : 0,
//     "attack" : 0.02,
//     "decay" : 0.8
//   },
//   "octaves" : 10
// }).toMaster();
// var kickPart = new Tone.Loop(function(time){
//   kick.triggerAttackRelease("C2", "8n", time);
// }, "2n").start(0);
//
// /*
//  SNARE
//  */
// var snare = new Tone.NoiseSynth({
//   "volume" : -5,
//   "envelope" : {
//     "attack" : 0.001,
//     "decay" : 0.2,
//     "sustain" : 0
//   },
//   "filterEnvelope" : {
//     "attack" : 0.001,
//     "decay" : 0.1,
//     "sustain" : 0
//   }
// }).toMaster();
// var snarePart = new Tone.Loop(function(time){
//   snare.triggerAttack(time);
// }, "2n").start("4n");
// /**
//  *  PIANO
//  */
// var piano = new Tone.PolySynth(4, Tone.Synth, {
//   "volume" : -8,
//   "oscillator" : {
//     "partials" : [1, 2, 1],
//   },
//   "portamento" : 0.05
// }).toMaster()
// var cChord = ["C4", "E4", "G4", "B4"];
// var dChord = ["D4", "F4", "A4", "C5"];
// var gChord = ["B3", "D4", "E4", "A4"];
// var pianoPart = new Tone.Part(function(time, chord){
//   piano.triggerAttackRelease(chord, "8n", time);
// }, [["0:0:2", cChord], ["0:1", cChord], ["0:1:3", dChord], ["0:2:2", cChord], ["0:3", cChord], ["0:3:2", gChord]]).start("2m");
// pianoPart.loop = true;
// pianoPart.loopEnd = "1m";
// pianoPart.humanize = true;

/*
 BASS
 */
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
var NOLA_notes = [];
var NYC_notes = [];

$.getJSON( "data/today.json", function( data ) {
  var str = "";

	$.each( data[0].forecast, function( key, val ) {
		if(key < 8) {
			var index = Math.round((val.temp % 21) / 3);
			str += key_c[index] + ",";
			LA_notes.push(key_c[index]);
		}
	});
	//console.log(LA_notes);

  $.each( data[1].forecast, function( key, val ) {
    if(key < 8) {
      var index = Math.round((val.temp % 21) / 3);
      str += key_c[index] + ",";
      NOLA_notes.push(key_c[index]);
    }
  });
  //console.log(NOLA_notes);

  $.each( data[2].forecast, function( key, val ) {
    if(key < 8) {
      var index = Math.round((val.temp % 21) / 3);
      str += key_c[index] + ",";
      NYC_notes.push(key_c[index]);
    }
  });
  //console.log(NYC_notes);

});

var pianoPart;

var playSong = function(city_button, city_notes, city_bpm, city_playing) {
  
  $(city_button).on("click", function() {
    
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
    var kickPart = new Tone.Loop(function(time){
      kick.triggerAttackRelease("C2", "8n", time);
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
      city_playing = true;
      $(this).text("Stop");
    }
  });
};

var LA_playing = false;
var NOLA_playing = false;
var NYC_playing = false;

playSong('#LA_play', LA_notes, 100, LA_playing);
playSong('#NOLA_play', NOLA_notes, 85, NOLA_playing);
playSong('#NYC_play', NYC_notes, 120, NYC_playing);
