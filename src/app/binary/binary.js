angular.module( 'ngBoilerplate.binary', [
  'ui.router',
  'placeholders',
  'ui.bootstrap',
  'ngBoilerplate.player',
  'ngBoilerplate.binarysynth'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'binary', {
    url: '/binary',
    views: {
      "main": {
        controller: 'BinaryCtrl',
        templateUrl: 'binary/binary.tpl.html'
      }
    },
    data:{ pageTitle: 'Binary Frame Generator' }
  });
})

.controller( 'BinaryCtrl', function BinaryCtrl( $scope, playerService, binarySynth ) {
  
  $scope.defaults = function() {
    $scope.param_text = 'Enter the payload for you binary frame here';
    $scope.param_period = '30';
    $scope.param_start_bits = '0';
    $scope.param_stop_bits = '0';
    $scope.param_frame_gap = '20';
    $scope.param_repeat_count = '0';
    $scope.param_sevenbit = '1';
    $scope.param_big_endian = '1';
    $scope.param_parity = '0';
    $scope.param_checksum = '0';
    $scope.param_mtu = '1500';
    $scope.param_encoding = 'RZ';
    $scope.param_encryption = "0";
  }; 

  $scope.defaults();

  // set our callback
  playerService.setStateChangeCallback( function( state ) {
    console.log("BinaryCtrl.callback: state=" + state );
    $scope.update();
    $scope.$apply();
  } );

  $scope.framingSetting = "15"; 

  $scope.update = function( ) {
    $scope.message = playerService.getStatus();

    // draw the oscilloscope
    var canvas = document.getElementById("scopecanvas");
    var context = canvas.getContext("2d");
    context.fillStyle="gray";
    var width = canvas.width;
    var height = canvas.height;
    context.clearRect(0, 0, width, height);
    var fsd = (height/2) * 0.8;
    var front_porch = 20;
    var raw_data = binarySynth( this.buildParams() );
    if( raw_data.length > 0 ) {
      context.beginPath();
      context.moveTo(0, (height/2));
      context.lineTo( front_porch, (height/2) );
      for ( var i= front_porch ; i < width ; i ++ ) {
        context.lineTo( i, (raw_data[i - front_porch] * fsd)+(height/2));
      }
      context.stroke();
    } else {
      context.beginPath();
      context.moveTo(0, (height/2) );
      context.lineTo( width, (height/2));
      context.stroke();
    }
    $scope.play_class = 
      (playerService.isPlayAvailable())?"btn-primary":"btn-default";
    $scope.stop_class = 
      (playerService.isStopAvailable())?"btn-primary":"btn-default";
  };
  
  $scope.change = function() {
    $scope.update();
  };

  $scope.buildParams = function() {
    var params = {
      text: $scope.param_text || '', 
      period: parseInt($scope.param_period, 10 ),
      start_bits: parseInt($scope.param_start_bits, 10),
      stop_bits: parseInt($scope.param_stop_bits, 10),
      frame_gap: parseInt($scope.param_frame_gap, 10),
      repeat_count: parseInt($scope.param_repeat_count, 10),
      sevenbit: parseInt($scope.param_sevenbit, 10),
      big_endian: parseInt($scope.param_big_endian, 10),
      parity: parseInt($scope.param_parity, 10),
      checksum: parseInt($scope.param_checksum, 10),
      mtu: parseInt($scope.param_mtu, 10),
      encoding: $scope.param_encoding,
      encryption: parseInt($scope.param_encryption, 10 )
    };
    return params;
  };
  $scope.startPow = function() {
    console.log("GDR: startPow()");
    playerService.startSynth( binarySynth, this.buildParams() );
    $scope.update( );
  };
  
  $scope.stopPow = function() {
    console.log("GDR: stopPow()");
    playerService.stopPow();
    $scope.update( );
  };
  
  $scope.update();
})

;
