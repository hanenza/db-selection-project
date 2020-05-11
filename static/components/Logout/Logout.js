

angular.module("myApp.Logout", ['ngRoute'])

  .config([
    '$routeProvider', function ($routeProvider) {
      $routeProvider.when('/Logout', {
        templateUrl: 'components/Login/Login.html',
        controller: 'LogoutController'
      });
    }])

  .controller("LogoutController", ["$scope", "service", '$http', '$window', '$rootScope','$location', function ($scope, service, $http, $window, $rootScope,$location) {
    // your code for logout , servise need to be clean , and the html page is login
    $rootScope.userName=true;
    $rootScope.login=false;
    $rootScope.logout=true;
    $rootScope.register=false;
    $rootScope.dashboard=true;
    $rootScope.projectName=true;
    $rootScope.sqlEditor=true;
    $rootScope.nfrTable=true;
    $rootScope.sqlEditor=true;
    $rootScope.umlEditor=true;
    $rootScope.adminPage = true;
    $rootScope.matrixWeight=true;
    $rootScope.about=false;
    service.FirstName="";
    service.LastName="";
    service.Email="";
    service.Password="";
    $location.path("#Login");
  }])
/*

 */