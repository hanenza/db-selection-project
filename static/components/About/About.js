angular.module("myApp.About", ['ngRoute'])

.config([
  '$routeProvider', function ($routeProvider) {
    $routeProvider.when('/About', {
      templateUrl: 'components/About/About.html',
      controller: 'AboutController'
    });
  }])

.controller("AboutController", ["$scope","service",  function($scope,service) {
// your code


}])
