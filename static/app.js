'use strict';

// Declare static level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.SQLEditor',
  'myApp.controller',
  'myApp.UMLEditor',
  'myApp.NFRTable',
  'myApp.MatrixWeight',
  'myApp.Register',
  'myApp.Login',
  'myApp.Dashboard',
  'myApp.ForgotPassword',
  'myApp.About',
  'myApp.Logout',
  'myApp.AdminPage'
])
  .config([
    '$routeProvider', function ($routeProvider) {
      $routeProvider
        .otherwise({ redirectTo: '/Login' });

    }])
    // .service('service', ['$http', "$rootScope", "$location", function ($http, $rootScope, $location) {
    //   $rootScope.indexBody = true;

    // }]);
