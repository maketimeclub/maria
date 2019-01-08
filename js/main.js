//create a synth and connect it to the master output (your speakers)
var synth = new Tone.Synth().toMaster();

var key_c = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C4"];

$('#LA_1').on("click", function() {
  console.log("LA Sound 1 Clicked");
  synth.triggerAttackRelease("C4", "8n");
});

$('#LA_2').on("click", function() {
  console.log("LA Sound 2 Clicked");
  synth.triggerAttackRelease("G4", "8n");
});

$('#LA_3').on("click", function() {
  console.log("LA Sound 3 Clicked");
  synth.triggerAttackRelease("E4", "8n");
});

$('#LA_4').on("click", function() {
  console.log("LA Sound 4 Clicked");
  synth.triggerAttackRelease("F4", "8n");
});

$('#NYC_1').on("click", function() {
  console.log("NYC Sound 1 Clicked");
  synth.triggerAttackRelease("C4", "8n");
});

$('#NYC_2').on("click", function() {
  console.log("NYC Sound 2 Clicked");
  synth.triggerAttackRelease("G4", "8n");
});

$('#NYC_3').on("click", function() {
  console.log("NYC Sound 3 Clicked");
  synth.triggerAttackRelease("E4", "8n");
});

$('#NYC_4').on("click", function() {
  console.log("NYC Sound 4 Clicked");
  synth.triggerAttackRelease("F4", "8n");
});

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


$.getJSON( "data/today.json", function( data ) {

	var str = "";
	var notes = [];
	$.each( data, function( key, val ) {
		if(key < 8) {
			var index = Math.round((val.temp % 21) / 3);
			str += key_c[index] + ",";
			notes.push(key_c[index]);
		}
	});
	
	console.log(notes);
	
	var bassPart = new Tone.Sequence(function(time, note){
	  bass.triggerAttackRelease(note, "16n", time);
	}, notes).start(0);
	// bassPart.probability = 0.9;
	
});

var playing = false;
$('#NOLA_play').on("click", function() {
	
  Tone.Transport.bpm.value = 90;
  if (playing) {
    Tone.Transport.stop();
    playing = false;
  } else {
    Tone.Transport.start("+0.1");
    synth.triggerAttackRelease();
    playing = true;
  }

});




