angular.moduel('example')
  .controller('ExampleController', [
    '$scope', 'Authentication',
    function($scope, Authentication) {
      $scope.authentication = Authentication;
    }
  ]);
