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
var bassPart;
var timerForVoice;
var timerForVoice2;

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

    // @todo, I cant figure out how to not play the other cities ... the stuff
    // below isn't working. I think cause the bass is a tone.js "sequence" and not a "part"
    if(bassPart) {
      bassPart.stop();
      bassPart.removeAll();
      bassPart.dispose();
    }

    var bassIndex = 1;
    var bassTemp = bassIndex;
    var bassNumber;

    bassPart = new Tone.Sequence(function(time, note){
      bass.triggerAttackRelease(note, "16n", time);
      // visualize the bass by highlighting one of the temperature slats
      bassNumber = element.closest('.city').find('.city__slat:nth-child(' + bassIndex + ')').attr("data-temp");
      element.closest('.city').find('.city__slat:nth-child(' + bassIndex + ') .slat').css("height", bassNumber);
      bassTemp = bassIndex;
      // unhighlight temperature slats after 1.5 seconds
      setTimeout(function(){
        element.closest('.city').find('.city__slat:nth-child(' + bassTemp + ') .slat').css("height", "10px");
      }, 150);
      if ( bassIndex < 8 ) {
        bassIndex++;
      } else {
        bassIndex = 1;
      }
    }, notes);
    bassPart.start(0);

    //
    var cChord = [notes[0]];
    var dChord = [notes[1]];
    var gChord = [notes[2]];

    var pianoIndex = 1;
    var pianoFull = 1;
    var pianoTemp = pianoIndex;
    var pianoLoop = 1;

    pianoPart = new Tone.Part(function(time, chord) {
      piano.triggerAttackRelease(chord, "32n", time);
      // visualize the piano by highlighting one of the temperature balls
      element.closest('.city').find('.ball:nth-child(' + pianoIndex + ')').addClass("active");
      pianoTemp = pianoIndex;
      // unhighlight temperature balls after 1.5 seconds
      setTimeout(function(){
        element.closest('.city').find('.ball:nth-child(' + pianoTemp + ')').removeClass("active");
      }, 150);
      if (pianoLoop == 2 && pianoIndex == 4) {
        pianoIndex = 0;
        pianoLoop = 1;
      } else if ( pianoIndex < 8 ) {
        pianoIndex++;
      } else {
        pianoIndex = 1;
        if (pianoLoop == 1) {
          pianoLoop = 2;
        } else {
          pianoLoop = 1;
        }
      }
    }, [
      ["0:0:0", [notes[0]]],
      ["0:0:2", [notes[1]]],
      ["0:1:0", [notes[2]]],
      ["0:1:2", [notes[3]]],
      ["0:2:0", [notes[4]]],
      ["0:2:2", [notes[5]]],
      ["0:3:0", [notes[6]]],
      ["0:3:2", [notes[7]]],
      ["0:4:0", [notes[0]]],
      ["0:4:2", [notes[1]]],
      ["0:5:0", [notes[2]]],
      ["0:5:2", [notes[3]]],
      ["0:6:0", [notes[4]]]
    ]);

    pianoPart.loop = true;
    pianoPart.loopEnd = "2m";
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

    // voice part
    var sing = function() {
      var i = 0;
      var speed = city_obj['bpm'] * 48;

      var singIt = function() {
        var word = city_obj['words'][i];
        var msg = new SpeechSynthesisUtterance(word);
        window.speechSynthesis.speak(msg);
        // responsiveVoice.speak(city_obj['words'][i], city_obj['voice']);
        i++;
        if (i > 7)
        i = 0;
      }
      singIt();
      timerForVoice = setInterval(singIt, speed);
    };

    //
    Tone.Transport.bpm.value = city_obj['bpm'];
    if (city_obj['playing']) {
      Tone.Transport.stop();
      $(this).text("Play");
      city_obj['playing'] = false;
      if(timerForVoice)
        clearTimeout(timerForVoice);
      if(timerForVoice2)
        clearTimeout(timerForVoice2);
    } else {
      Tone.Transport.start("+0.1");
      synth.triggerAttackRelease();
      timerForVoice2 = setTimeout(function(){ sing(); }, 4000);
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
      city_obj['temps'].push(Math.floor(val.temp));
    }
  });

  $( document ).ready(function() {

    // create temperature balls for piano
    for (var i = 0; i < city_obj['temps'].length; i++) {
      var value = 100 - city_obj['temps'][i]
      $('#' + city_obj['id']).find('.city__balls').append('<div class="city__ball ball"><div style="top:' + value + '%;">' + city_obj['temps'][i] + '°</div></div>')
    }
    // create temperature slats for bass
    for (var i = 0; i < city_obj['temps'].length; i++) {
      var value = 100 - city_obj['temps'][i]
      $('#' + city_obj['id']).find('.city__slats').append('<div class="city__slat" data-temp="' + city_obj['temps'][i] + '"><div class="slat"></div><div class="slat-stat">' + city_obj['temps'][i] + '°</div></div>')
    }
  });
}

var LA = {
  'id': 'city_la',
  'playing': false,
  'notes': [],
  'temps': [],
  'bpm': 100,
  'voice': "UK English Male",
  'words': [],
};

var NOLA = {
  'id': 'city_nola',
  'playing': false,
  'notes': [],
  'temps': [],
  'bpm': 100,
  'voice': "French Female",
  'words': [],
};

var NYC = {
  'id': 'city_nyc',
  'playing': false,
  'notes': [],
  'temps': [],
  'bpm': 100,
  'voice': "Japanese Male",
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
