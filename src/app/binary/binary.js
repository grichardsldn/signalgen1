angular.module( 'ngBoilerplate.binary', [
  'ui.router',
  'placeholders',
  'ui.bootstrap'
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

.controller( 'BinaryCtrl', function BinaryCtrl( $scope ) {
})

;
