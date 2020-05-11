angular.module("myApp.ForgotPassword", ['ngRoute'])

.config([
  '$routeProvider', function ($routeProvider) {
    $routeProvider.when('/ForgotPassword', {
      templateUrl: 'components/ForgotPassword/ForgotPassword.html',
      controller: 'ForgotPasswordController'
    });
  }])

.controller("ForgotPasswordController", ["$scope","service",  function($scope,service) {
// your code


}])
