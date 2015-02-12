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
      text: 'HELLO WORLD',
      period: 30,
      start_bits: 2,
      stop_bits: 2,
      frame_gap: 20,
      repeat_count: 0,
      sevenbit: 0,
      big_endian: 0,
      parity: 1,
      checksum: 1,
      mtu: 1500,
      encoding: 'NRZ',
      encryption: 0
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
