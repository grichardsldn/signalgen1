angular.module('ngBoilerplate.player', [])

.service('playerService', function() {
  console.log("GDR: count factory invoked");

  this.setState = function( newstate ) {
    console.log( 'state: ' + state + ' -> ' + newstate);
    state = newstate;
    if( statechange_callback !== undefined ) {
      console.log("Firing callback");
      statechange_callback( newstate );
    }
  };


  var state = 'uninitialised';
  var audiocontext;
  var destnode; // the final output node
  var gainnode; 
  var absn; // audio buffer source node
  var statechange_callback;

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

  this.setStateChangeCallback = function( cb ) {
    console.log("setStateChangeCallback()");
    statechange_callback = cb;
  };

  this.startSynth = function( synth, params ) {
    console.log('startSynth()');
    if( state === 'available' ) {
      this.setState('playing');
      var raw_data = synth( params );

      // create a buffer
      var ab = audiocontext.createBuffer( 1, raw_data.length, 48000 );
      var data = ab.getChannelData(0);

      // copy the data from the raw_data
      for (i = 0 ; i < data.length ; i++ ) {
        data[i] = raw_data[i];
      }
      console.log("copied the buffer");
      absn = audiocontext.createBufferSource();
      absn.buffer = ab;
      absn.connect( gainnode);
      var me = this;
      absn.onended = function() {
        console.log("AudioBufferSourceNode ended");  
        me.setState('available');
      };
      absn.start();
    }
  };

  this.startPow = function( rate ) {
    rate *= 1;
    console.log('startPow(' + rate + ')');
    if( state === 'available' ) {
      this.setState('playing');
      // create a buffer and play it
      var ab = audiocontext.createBuffer( 1, 48000 * 2, 48000 );
      var data = ab.getChannelData(0);

      var i = 0;
      var level = 0;
      var left = 0;
      var period = 5;
      for (i = 0 ; i < data.length ; i++ ) {
        data[i] = level;
        if( left < 0 ) {
          level = Math.random() * 2 - 1; // reset the level
          left = Math.random() * period; // wait a random time based on freq
          period += rate; // lower the period
        }
        left--;
      }
      console.log("built the buffer");
      absn = audiocontext.createBufferSource();
      absn.buffer = ab;
      absn.connect( gainnode);
      var me = this;
      absn.onended = function() {
        console.log("AudioBufferSourceNode ended");  
        me.setState('available');
      };
      absn.start();
    }
  };

  this.stopPow = function() {
    if( state === 'playing' ) {
      absn.disconnect(gainnode);
      this.setState('available');
    }
  };

  this.isPlayAvailable = function() {
    return (state === 'available' )?true:false;
  };

  this.isStopAvailable = function() {
    return (state === 'playing' )?true:false;
  };
});


