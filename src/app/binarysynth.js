angular.module('ngBoilerplate.binarysynth', [])

// Takes a set of params and returns an array of the synthesised data.
.service('binarySynth', function() {

  // output buffer vars:
  var output = [];
  var write_pointer = 0;

  var frame_octet_total; // used for checksum
  var frame_ones_total;  // used for parity

  var one_ms = 48; // 1millisecond, should work this out from samplerate

  // write and audio sample to the output buffer
  var writeSample = function( val ) {
    if( val > 1.0 ) {
      val = 1.0;
    } else if ( val < -1.0 ) {
      val = -1.0;
    } 
    output[write_pointer++] = val; 
  };

  // write a logic of 'bit' of data using the specific bit encoding
  var writeBit = function( val, params ) {
    var magnitude = 0.9; // most of Full Scale Defelection
    // val = Math.floor( val) & 1; // get the LSB
    //console.log("writeBit: " + write_pointer + '=' + val );
    var i;
    if (val === 1 ) {
      frame_ones_total ++;
    }
    if (params.encoding === 'NRZ') {
      for( i = 0 ; i < params.period ; i++ ) {
        writeSample( ((magnitude * 2) * val) - magnitude );
      } 
    } else {
      // RZ - half a period of the value, half of zero.
      for( i = 0 ; i < params.period / 2 ; i++ ) {
        writeSample( ((magnitude * 2) * val) - magnitude );
      }
      for( i = 0 ; i < params.period / 2 ; i++ ) {
        writeSample( 0 );
      }
    }
  };

  // write a value as 32 unsigned logical bits 
  var write32 = function( val, params ) {
    var i;
    if( params.big_endian ) {
      for( i = 0 ; i < 32 ; i++ ) {
        writeBit( (( val & 0x80000000)>0)?1:0, params );
        val <<=1;
      }
    } else {
      for( i = 0 ; i < 32 ; i++ ) {
        writeBit( val & 1, params );
        val >>= 1;
      }
    } 
  };

  // write a value as 7 or 8 logics bits.
  var writeByte = function( val, params ) {
    var orig_val = val;
    var num_bits = 8;
    var i;
    if( params.sevenbit ) {
      // lose the top bit
      val = Math.floor( val ) & 0x7f;
      num_bits = 7;
    }

    frame_octet_total += val;
    if( params.big_endian ) {
      if( num_bits === 7 ) {
        // move val so the first bit is at teh top
        val <<= 1;
      }
      for( i = 0 ; i < num_bits ; i++ ) {
        writeBit(((val & 0x80)>0)?1:0, params );
        val <<= 1;
      }
    } else {
      for( i = 0 ; i < num_bits ; i++ ) {
        writeBit( val & 1, params );
        val >>= 1;
      }
    }
    console.log("wrote byte: " + orig_val );
  };

  var expandText = function( input, repeat_count ) {
    var output;
    for( var i = 0 ; i < input.length ; i ++ ) {
      var added = input.charAt( i );
        for( var j = 0 ; j < repeat_count ; j++ ) {
          output += added.toString(); 
      }
    }
    return output;
  };

  var writeFrame = function( payload, params ) {
    var i;
    console.log("Frame Started");
    console.log("encryption=" + params.encryption );
    // write start bits
    for( i = 0 ; i < (params.start_bits || 0) ; i++)  {
      writeBit( 1, params );
    }
    console.log("start bits done");

    frame_octet_total = 0;
    frame_ones_total = 0;
    
    // call writeByte() for each letter of the message repeating
    // based on repeat_count
    for( i = 0 ; i < payload.length ; i++ ) {
      var data = payload.charCodeAt( i ); 
      if( params.encryption ) {
        // hehe, naughty
        data = Math.floor(Math.random() * (256));
      }
      writeByte( data, params );
    }
    
    if( params.checksum ) {
      var checksum = ~(Math.floor(frame_octet_total));
      write32( checksum, params );
    }
    console.log("checksum done");

    if( params.parity ) {
      // even parity
      writeBit( frame_ones_total & 1, params );
    }
    console.log("parity done");

    for( i = 0 ; i < params.stop_bits ; i++ ) {
      // stop bits
      writeBit( 0, params );
    }   
    console.log("stop bits done");

    for( i = 0 ; i < ( one_ms * params.frame_gap) ; i++) {
      // silence between frames
      writeSample(0);
    }
    console.log("interframe gap done");
  };

  // this service is just one function that returns an array of data
  // based on the params given.
  //
  // params are:
  //   text
  //   period
  //   start_bits
  //   stop bits
  //   frame_gap
  //   repeat_count
  //   sevenbit
  //   big_endian
  //   parity
  //   checksum
  //   mtu
  //   encoding (NRZ(default) or RZ)
  //   encryption
  // 
  return function( params ) {
    console.log("Invoked binarySynth: encoding=" + params.encoding);

    output = [];
    write_pointer = 0;
    
    // expand any chars if required
    if( params.repeat_count ) {
      params.text = expandText( params.text, params.repeat_count );
    }

    // go through and write the various frames until there is 
    // no param_text left
    var substring = params.text;
    while( (substring = params.text.slice( 0, params.mtu )).length > 0) {
      console.log( substring );
      writeFrame( substring, params );
      params.text = params.text.slice( params.mtu );
    }
      
    return output;
  };
});


