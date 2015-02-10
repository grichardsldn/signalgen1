angular.module( 'ngBoilerplate.binary', [
  'ui.router',
  'placeholders',
  'ui.bootstrap',
  'ngBoilerplate.player'
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

.controller( 'BinaryCtrl', function BinaryCtrl( $scope, playerService ) {
  
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
    playerService.startPow($scope.framingSetting);
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
