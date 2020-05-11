
angular.module("myApp.NFRTable", ['ngRoute'])


  .config([
    '$routeProvider', function ($routeProvider) {
      $routeProvider.when('/NFRTable', {
        templateUrl: 'components/NFRTable/NFRTable.html',
        controller: 'NFRTableController'
      });
    }])

  .controller("NFRTableController", ["$scope", "$document", "service", "$http", function ($scope, $document, service, $http) {

    self = $scope;
    //update the list of the classes by uml class
    $scope.classList = service.classList;
    $scope.NFREditorList = {};

    // was changed
    self.UpdateTheJSON = function () {
      var jsonString = JSON.stringify(service.umlgraph)
      service.jsonOfProject.UmlJson = jsonString
      service.jsonOfProject.SqlEditor = service.sqlEditorList
      service.jsonOfProject.NfrEditor = service.NFREditorList
      service.jsonOfProject.NFRDefalutValue = service.nfrDefalutValue
      service.jsonOfProject.ComponentDefalutValue=service.componentDefalutValue
      service.jsonOfProject.ClassNumber = service.classnumber
      service.jsonOfProject.NamesInUml = service.allnames
      var json = {
        ProjectJson: service.jsonOfProject,
        ProjectId: service.ProjectId
      }
      $http.post('/UpdateProjectJson', json).then(function (response) {
      }, function (errResponse) {
        console.log(errResponse);
      });
    }

    self.sendRequest = function () {
      self.UpdateTheJSON();
      $http.post('/getNFR', { "tableInfo": $scope.NFREditorList, "defalutValue": $scope.nfrDefalutValue }).then(function (response) {
        genTable(response);
      }, function (errResponse) {
        console.log("step 2");
      });
    }

    function genTable(data) {
      var table = "<table class='showMatrixTable'><tr><td></td>"
      var list = data.data.data;
      var i;
      var j;
      for (i = 0; i < list.length; i++) {
        for (j = 0; j < list[0].length; j++) {
          // the first row in the table
          if (i == 0) {
            table = table + "<td>" + list[i][j] + "</td>"
            if (j == list[0].length - 1) {
              table = table + "</tr>"
            }
          }
          else {
            if (j == 0) {
              table = table + "<tr><td>" + list[0][i - 1] + "</td>" + "<td>" + list[i][j] + "</td>"
            }
            else {
              table = table + "<td>" + list[i][j] + "</td>"
              if (j == list[0].length - 1) {
                table = table + "</tr>"
              }
            }
          }
        }
      }
      table = table + "</table>"
      var myElements = document.querySelector('#showMatrixTable');
      try {
        while (true) {
          myElements.removeChild(myElements.childNodes[0]);
        }
      }
      catch (error) {
      }
      var htmlStr = '<div class="row dataPane"> ' + table + ' </div>';
      angular.element(document.getElementById('showMatrixTable')).append(htmlStr);
      //show table
      var target = $document[0].getElementById('showMatrix');
      target.style.display = 'block';
    }

    self.closeMatrixWindowModal = function () {
      document.getElementById('showMatrix').style.display = 'none';
    };

    self.updateTheNFRByTheUML = function () {
      var classListNames = []; //saves the names of the uml classes
      var tmpNFREditorList = service.NFREditorList; //saves the name of the classes in the nfr editor
      var i;
      for (i = 0; i < service.classList.length; i++) {
        classListNames.push(service.classList[i].name);
      }
      for (var key in service.NFREditorList) {
        if (classListNames.indexOf(key) < 0) {
          delete tmpNFREditorList[key];
        }
      }
      service.NFREditorList = tmpNFREditorList;
    }

    self.getDefalutJson = function () {
      answer = {}
      for (var key in service.nfrDefalutValue) {
        answer["key"] = 0;
      }
      return answer;
    }

    self.getNFRDefaultValue = function () {
      if (angular.equals(service.nfrDefalutValue, service.NFREditorList)) {
        $http.post('/getNFRDefaultValue').then(function (response) {
          $scope.nfrDefalutValue = response.data;
          service.nfrDefalutValue = $scope.nfrDefalutValue;
          self.setDefalutValueForNewClasses();
        }, function (errResponse) {
          console.log(errResponse);
        });
      } else {
        self.updateTheNFRByTheUML();
        $scope.NFREditorList = service.NFREditorList;
        $scope.nfrDefalutValue = service.nfrDefalutValue;
        self.setDefalutValueForNewClasses();
      }
    }

    self.save = function (value, className, nfr) {
      $scope.NFREditorList[className][nfr] = value;
      service.NFREditorList = $scope.NFREditorList;
      service.nfrDefalutValue = $scope.nfrDefalutValue;
    };

    self.mySort=function(myJson){
      var myAnswer=[];  
      for (var key in myJson) {
        myAnswer.push({"name":key,"value": myJson[key]});
      }
      return myAnswer;
    }

    self.getMinValue = function (nfrInput) {
      if (nfrInput.type == "Range") {
        return nfrInput.min;
      }
      if (nfrInput.type == "Select Box") {
        var min = 10000;
        for (var key in nfrInput.legend) {
          if (nfrInput.legend[key] < min) {
            min = nfrInput.legend[key]
          }
        }
        return min;
      }
    }


    self.setDefalutValueForNewClasses = function () {
      var oldClasses = []; //saves the name of the classes in the nfr editor
      var i;
      for (var key in service.NFREditorList) {
        oldClasses.push(key)
      }
      for (i = 0; i < service.classList.length; i++) {
        if (oldClasses.indexOf(service.classList[i].name) < 0) {
          $scope.NFREditorList[service.classList[i].name] = self.getDefalutJson();
          for (var key in service.nfrDefalutValue) {
            var min = self.getMinValue($scope.nfrDefalutValue[key]);
            self.save(min, service.classList[i].name, key);
          }
        }
      }
      service.NFREditorList = $scope.NFREditorList;
    };

    self.UpdateTheJSON()
    self.getNFRDefaultValue();


  }]);


