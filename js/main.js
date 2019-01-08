//create a synth and connect it to the master output (your speakers)
var synth = new Tone.Synth().toMaster();

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



$('#NOLA_1').on("click", function() {
  console.log("NOLA Sound 1 Clicked");
  synth.triggerAttackRelease("C4", "8n");
});

$('#NOLA_2').on("click", function() {
  console.log("NOLA Sound 2 Clicked");
  synth.triggerAttackRelease("G4", "8n");
});

$('#NOLA_3').on("click", function() {
  console.log("NOLA Sound 3 Clicked");
  synth.triggerAttackRelease("E4", "8n");
});

$('#NOLA_4').on("click", function() {
  console.log("NOLA Sound 4 Clicked");
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
