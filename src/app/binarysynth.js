angular.module('ngBoilerplate.binarysynth', [])

// Takes a set of params and returns an array of the synthesised data.
.service('binarySynth', function() {
  return function( params ) {
    console.log("Invoked binarySynth");
    var output = [];
    var write_pointer = 0;
  
    var i;
    for( i = 0 ; i < 10000 ; i++ ) {
      output[write_pointer++] = -0.5;
      output[write_pointer++] = -0.5;
      output[write_pointer++] = -0.5;
      output[write_pointer++] = -0.5;
      output[write_pointer++] = 0.5;
      output[write_pointer++] = 0.5;
      output[write_pointer++] = 0.5;
      output[write_pointer++] = 0.5;
    }
    return output;
  };
});


