angular.module("myApp.Register", ['ngRoute'])

  .config([
    '$routeProvider', function ($routeProvider) {
      $routeProvider.when('/Register', {
        templateUrl: 'components/Register/Register.html',
        controller: 'RegisterController'
      });
    }])

  .controller("RegisterController", ['$scope', 'service', '$http', '$location', '$window', function ($scope, service, $http, $location, $window) {
    // your code
    var self = $scope;

    $scope.userDetails = {}
    getQuestion();

    self.register = function () {
      $http.post('/registerUser', $scope.userDetails).then(function (response) {
        $window.alert(response.data.data);
        if (response.data.data == "Registered succsefuly!") {
          $location.path("#/Login");
        }
      }, function (errResponse) {
        console.log(errResponse);
      });
    }

    function getQuestion() {
      $http.post('/getQuestion', {}).then(function (response) {
        $scope.questions = response.data;
      }, function (errResponse) {
        console.log(errResponse);
      });
    }

    $('#password, #password_c').on('keyup', function () {
      if ($('#password').val() == $('#password_c').val()) {
        $('#message').html('Matching').css('color', 'green');
      } else
        $('#message').html('Not Matching').css('color', 'red');
    });
  }])
