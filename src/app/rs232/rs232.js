angular.module( 'ngBoilerplate.rs232', [
  'ui.router',
  'placeholders',
  'ui.bootstrap',
  'ngBoilerplate.player',
  'ngBoilerplate.binarysynth'
])

.config(function config( $stateProvider ) {
  $stateProvider.state( 'rs232', {
    url: '/rs232',
    views: {
      "main": {
        controller: 'RS232Ctrl',
        templateUrl: 'rs232/rs232.tpl.html'
      }
    },
    data:{ pageTitle: 'RS-232 Frame Generator' }
  });
})

.controller( 'RS232Ctrl', function RS232Ctrl( $scope, playerService, binarySynth ) {
  
  $scope.defaults = function() {
    $scope.param_text = 'ATDT07941988461\nCONNECT\nHANGUP';
    $scope.param_period = '30';
    $scope.param_start_bits = '1';
    $scope.param_stop_bits = '1';
    $scope.param_frame_gap = '0';
    $scope.param_repeat_count = '0';
    $scope.param_sevenbit = '0';
    $scope.param_big_endian = '1';
    $scope.param_parity = '0';
    $scope.param_checksum = '0';
    $scope.param_mtu = '1';
    $scope.param_encoding = 'NRZ';
    $scope.param_encryption = "0";
  }; 

  $scope.defaults();

  // set our callback
  playerService.setStateChangeCallback( function( state ) {
    console.log("RS232Ctrl.callback: state=" + state );
    $scope.update();
    $scope.$apply();
  } );

  $scope.framingSetting = "15"; 

  $scope.update = function( ) {
    $scope.message = playerService.getStatus();
    $scope.play_class =
      (playerService.isPlayAvailable())?"btn-primary":"btn-default";
    $scope.stop_class =
      (playerService.isStopAvailable())?"btn-primary":"btn-default";

  };

  $scope.startPow = function() {
    var params = {
      text: $scope.param_text,
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
    playerService.startSynth( binarySynth, params );
    $scope.update( );
  };
  
  $scope.stopPow = function() {
    playerService.stopPow();
    $scope.update( );
  };
  
  $scope.update();
})

;
