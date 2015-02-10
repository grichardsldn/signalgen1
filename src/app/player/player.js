angular.module('ngBoilerplate.player', [])

.service('playerService', function() {
  console.log("GDR: count factory invoked");
  var num = 0;
  this.count = function() {
    console.log("GDR: count invoked");
    num++;
    return num; 
  };

  this.setState = function( newstate ) {
    console.log( 'state: ' + state + ' -> ' + newstate);
    state = newstate;
  };


  var state = 'uninitialised';
  var audiocontext;
  var destnode; // the final output node
  var gainnode; 
  var osc;

  try {
    audiocontext = new AudioContext();
    destnode = audiocontext.destination;
    gainnode = audiocontext.createGain();
    gainnode.gain.value = 0.3;
    gainnode.connect( destnode);
    this.setState('available');
  } catch  (e) {
    console.log("Exception whilst getting audio: " + e.message);
    audiocontext = undefined;
    this.setState('failed');
  }

  /* unavailable, available, playing */
  this.getStatus = function() {
    return state;
  };

  this.startPow = function() {
    if( state === 'available' ) {
      this.setState('playing');
      osc = audiocontext.createOscillator();
      osc.frequency.value = 220;
      osc.start(0);
      osc.connect(gainnode);
    }
  };

  this.stopPow = function() {
    if( state === 'playing' ) {
      osc.disconnect(gainnode);
      this.setState('available');
    }
  };
});


