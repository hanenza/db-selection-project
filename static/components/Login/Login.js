angular.module("myApp.Login", ['ngRoute'])

  .config([
    '$routeProvider', function ($routeProvider) {
      $routeProvider.when('/Login', {
        templateUrl: 'components/Login/Login.html',
        controller: 'LoginController'
      });
    }])

  .controller("LoginController", ["$scope", "service", '$http', '$window', '$location', '$rootScope', '$document', function ($scope, service, $http, $window, $location, $rootScope, $document) {
    // your code
    var self = $scope;

    $scope.User = { "Email": $scope.Email, "Password": $scope.Password };
    self.Login = function () {
      $http.post('/login', $scope.User).then(function (response) {
        try {
          if (response.data.Email == "admin") {
            $location.path("/AdminPage");
            $rootScope.adminPage = false;
            $rootScope.userName = false;
            $rootScope.login = true;
            $rootScope.logout = false;
            $rootScope.register = true;
            $rootScope.about = true;
            service.FirstName = response.data.FirstName;
            service.LastName = response.data.LastName;
            service.Email = response.data.Email;
            service.Password = response.data.Password;
            $rootScope.nameOfTheUser = " hello " + response.data.FirstName + " " + response.data.LastName;
          }
          else if (response.data.data != "Login failed ,User Name Or Password Is Incorrect") {
            $rootScope.dashboard = false;
            $location.path("/Dashboard");
            $rootScope.userName = false;
            $rootScope.login = true;
            $rootScope.logout = false;
            $rootScope.register = true;
            $rootScope.about = false;
            service.FirstName = response.data.FirstName;
            service.LastName = response.data.LastName;
            service.Email = response.data.Email;
            service.Password = response.data.Password;
            $rootScope.nameOfTheUser = " hello " + response.data.FirstName + " " + response.data.LastName;
          }
          else {
            $window.alert(response.data.data);
          }
        }
        catch (err) {
          window.alert(response.data.data);
        }
      }, function (errResponse) {
        console.log("login fail");
      });
    }

    self.restPassword = function () {
      $('#restPasswordModal').modal('show');
    }


    self.sumbitRestPassword= function () {
      $('#restPasswordModal').modal('hide');
      $http.post('/restPassword', {"Email":self.restPasswordEmail}).then(function (response) {
        self.restPasswordEmail="";
      }, function (errResponse) {
        console.log(errResponse)
      });
    }


  }])
/*

 */