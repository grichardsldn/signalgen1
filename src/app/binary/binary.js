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
    $scope.param_text = "Payload goes here";
    $scope.param_period = "30";
    $scope.param_start_bits = "0";
    $scope.param_stop_bits = "0";
    $scope.param_frame_gap = 20;
    $scope.param_repeat_count = 0;
    $scope.param_sevenbit = 1;
    $scope.param_big_endian = 0 ;
    $scope.param_parity = 0 ;
    $scope.param_checksum = 0;
    $scope.param_mtu = 1500;
    $scope.param_encoding = "NRZ";
    $scope.param_encryption = "1";
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
  };

  $scope.callCount = function() {
    console.log("GDR: callCount()" );
    playerService.count();
    $scope.update( );
  };

  $scope.startPow = function() {
    console.log("GDR: startPow()");
    var params = {
      text: $scope.param_text,
      period: parseInt($scope.param_period, 10 ),
      start_bits: $scope.param_start_bits,
      stop_bits: $scope.param_stop_bits,
      frame_gap: $scope.param_frame_gap,
      repeat_count: $scope.param_repeat_count,
      sevenbit: $scope.param_sevenbit,
      big_endian: $scope.param_big_endian,
      parity: $scope.param_parity,
      checksum: $scope.param_checksum,
      mtu: $scope.param_mtu,
      encoding: $scope.param_encoding,
      encryption: parseInt($scope.param_encryption, 10 )
    };
    playerService.startSynth( binarySynth, params );
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
