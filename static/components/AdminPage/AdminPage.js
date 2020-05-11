//23/4
angular.module('myApp.AdminPage', ['ngRoute'])

  .config([
    '$routeProvider', function ($routeProvider) {
      $routeProvider.when('/AdminPage', {
        templateUrl: 'components/AdminPage/AdminPage.html',
        controller: 'AdminPageController'
      });
    }])

  .controller("AdminPageController", ["$scope", "$document", "service", "$http", "$window", "$rootScope", "$location", function ($scope, $document,
    service, $http, $window, $rootScope, $location) {

    self = $scope;
    $scope.usersTable = true;
    $scope.questionTable = true;
    $scope.dbPrfilesTable = true;
    $scope.defaultValuesTable = true;
    $scope.Showprojects = true;
    self.systemMessage = "";
    self.usresArray;
    self.newDB = {};
    $scope.choiseArray = {};
    $scope.newSelect = {};
    $scope.defaultNFR = {};
    $scope.rangeJson = {};
    $scope.myChoise = "range";
    $scope.tmp = {};

    self.users = function () {
      self.updateLayout(0);
      $http.post('/getUsersInfo', { "Email": service.Email, "Password": service.Password }).then(function (response) {
        $scope.dbTable = response.data;
        self.usresArray = response.data;
      }, function (errResponse) {
        console.log(errResponse);
      });
    }

    self.deleteUser = function (email) {
      $http.post('/deleteUser', { "Email": service.Email, "Password": service.Password, "UserEmail": email }).then(function (response) {
        $scope.dbTable = response.data;
        self.users();
      }, function (errResponse) {
        console.log(errResponse);
      });
    }

    self.dbProfiles = function () {
      self.updateLayout(2);
      $http.post('/getDBProfiles', { "Email": service.Email, "Password": service.Password }).then(function (response) {
        $scope.dbTable = response.data;
      }, function (errResponse) {
        console.log(errResponse);
      });
    }

    self.castingJsonValueToNumber = function (jsonObject) {
      for (var key in jsonObject) {
        if (!isNaN(jsonObject[key])) {
          jsonObject[key] = parseFloat(jsonObject[key]);
        }
      }
      return jsonObject;
    }

    self.deleteDBProfile = function (dbName) {
      $http.post('/deleteDBProfile', { "Email": service.Email, "Password": service.Password, "dbName": dbName }).then(function (response) {
        self.dbProfiles();
      }, function (errResponse) {
        console.log(errResponse);
      });
    }

    self.addDBProfile = function () {
      if (!self.checkInputs(self.newDB)) {
        self.systemMessage = "All Inputs Is Requried";
        $('#myModal').modal('show');
        return;
      }
      // if (!self.checkSumEqualOne(self.newDB, "")) {
      //   self.systemMessage = "The Sum Of All NFR Values Should Be Equal To 1";
      //   $('#myModal').modal('show');
      //   return;
      // }
      $http.post('/addDBProfile', { "Email": service.Email, "Password": service.Password, "db": self.castingJsonValueToNumber(self.newDB) }).then(function (response) {
        if (response.data.data == "DB name Is Exist") {
          self.systemMessage = response.data.data;
          $('#myModal').modal('show');
        }
        else {
          self.dbProfiles();
          self.newDB = {};
        }
      }, function (errResponse) {
        console.log(errResponse);
      });
    }

    self.checkInputs = function (jsonObject) {
      var sum = -1;
      for (var key in jsonObject) {
        sum = sum + 1;
      }
      return sum == Object.keys($scope.defaultNFR).length;
    }

    self.checkSumEqualOne = function (jsonObject, type) {
      if (type == "NFR") {
        jsonObject = self.castingJsonValueToNumber(jsonObject);
        var sum = 0;
        for (var key in jsonObject) {
          if (!isNaN(jsonObject[key].value)) {
            var value = jsonObject[key].value;
            sum = sum + parseFloat(value);
          }
        }
        return sum.toFixed(4) == 1;
      }
      jsonObject = self.castingJsonValueToNumber(jsonObject);
      var sum = 0;
      for (var key in jsonObject) {
        if (!isNaN(jsonObject[key])) {
          var value = jsonObject[key];
          sum = sum + parseFloat(value);
        }
      }
      return sum.toFixed(4) == 1;
    }

    self.projects = function (json) {
      console.log("project form clicked");
      self.updateLayout(1);
      var json = {
        UserName: service.Email
      }
      $http.post('/getAllprojects', json).then(function (response) {
        $scope.projectTable = response.data;
        console.log(response.data)
      }, function (errResponse) {
        console.log(errResponse);
      });
    }

    self.questions = function () {
      self.updateLayout(3);
      $http.post('/getQuestion', {}).then(function (response) {
        $scope.dbTable = response.data;
      }, function (errResponse) {
        console.log(errResponse);
      });
    }

    self.deleteQuestion = function (question) {
      $http.post('/deleteQuestion', { "Email": service.Email, "Password": service.Password, "question": question }).then(function (response) {
        self.questions();
      }, function (errResponse) {
        console.log(errResponse);
      });
    }

    self.addQuestion = function () {
      if ($scope.questionInput != "") {
        $http.post('/addQuestion', { "Email": service.Email, "Password": service.Password, "question": $scope.questionInput }).then(function (response) {
          $scope.questionInput = "";
          self.questions();
        }, function (errResponse) {
          console.log(errResponse);
        });
      }
      else {
        self.systemMessage = "Please Insert Question";
        $('#myModal').modal('show');
      }
    }

    self.defaultValues = function () {
      console.log("ibrahipajnfklan");
      self.updateLayout(4);
      self.getNFRDefaultValue();
      self.getComponentDefaultValues();
    }

    self.updateLayout = function (number) {
      $scope.usersTable = true;
      $scope.Showprojects = true;
      $scope.dbPrfilesTable = true;
      $scope.questionTable = true;
      $scope.defaultValuesTable = true;
      switch (number) {
        case 0:
          $scope.usersTable = false;
          break;
        case 1:
          $scope.Showprojects = false;
          break;
        case 2:
          $scope.dbPrfilesTable = false;
          break;
        case 3:
          $scope.questionTable = false;
          break;
        case 4:
          $scope.defaultValuesTable = false;
          console.log($scope.defaultValuesTable);
          break;
        default:
          $scope.usersTable = false;
      }
    }

    self.getNFRDefaultValue = function () {
      console.log("getNFRDefaultValue");
      $http.post('/getNFRDefaultValue').then(function (response) {
        if (response.data == null) {
          $scope.defaultNFR = {};
        }
        else {
          $scope.defaultNFR = response.data;
        }
      }, function (errResponse) {
        console.log(errResponse);
      });
    }

    self.getComponentDefaultValues = function () {
      console.log("getComponentDefaultValues");
      $http.post('/getComponentDefaultValues').then(function (response) {
        $scope.defaultComponent = response.data;
      }, function (errResponse) {
        console.log(errResponse);
      });
    }

    self.updateDefaultNFR = function () {
      if (self.checkSumEqualOne($scope.defaultNFR, "NFR")) {
        $http.post('/updateDefaultNFR', { "Email": service.Email, "Password": service.Password, "nfrValues": self.castingJsonValueToNumber($scope.defaultNFR) }).then(function (response) {
          self.systemMessage = response.data.data;
          $('#myModal').modal('show');
        }, function (errResponse) {
          console.log(errResponse);
        });
      }
      else {
        self.systemMessage = "The Sum Of All NFR Values Should Be Equal To 1";
        $('#myModal').modal('show');
      }
    }

    self.updateDefaultComponent = function () {
      if (self.checkSumEqualOne($scope.defaultComponent, "")) {
        $http.post('/updateDefaultComponent', { "Email": service.Email, "Password": service.Password, "componentValues": self.castingJsonValueToNumber($scope.defaultComponent) }).then(function (response) {
          self.systemMessage = response.data.data;
          $('#myModal').modal('show');
        }, function (errResponse) {
          console.log(errResponse);
        });
      }
      else {
        self.systemMessage = "The Sum Of All Component Values Should Be Equal To 1";
        $('#myModal').modal('show');
      }
    }

    self.openAddNewNfrModal = function () {
      $('#nfrModal').modal('show');
    }

    self.addNewNFR = function () {
      if ($scope.myChoise == "selectBox") {
        $scope.defaultNFR[$scope.tmp.newNfrName] = { "value": 0, "type": "Select Box", "legend": $scope.choiseArray };
      }
      if ($scope.myChoise == "range") {
        $scope.defaultNFR[$scope.tmp.newNfrName] = { "value": 0, "type": "Range", "max": parseFloat($scope.rangeJson.maxValue), "min": parseFloat($scope.rangeJson.minValue), "step": parseFloat($scope.rangeJson.stepValue) };
      }
      $scope.tmp.newNfrName = "";
      $http.post('/updateDefaultNFR', { "Email": service.Email, "Password": service.Password, "nfrValues": $scope.defaultNFR }).then(function (response) {
        self.systemMessage = response.data.data;
        $('#nfrModal').modal('hide');
        self.getNFRDefaultValue();
        $scope.choiseArray = {};
        $scope.rangeJson = {};
      }, function (errResponse) {
        console.log(errResponse);
      });
    }

    self.deleteNFR = function (nfrName) {
      delete $scope.defaultNFR[nfrName];
      $http.post('/updateDefaultNFR', { "Email": service.Email, "Password": service.Password, "nfrValues": self.castingJsonValueToNumber($scope.defaultNFR) }).then(function (response) {
        self.getNFRDefaultValue();
      }, function (errResponse) {
        console.log(errResponse);
      });
    }

    self.addNewSelectBoxChoise = function () {
      $scope.choiseArray[$scope.newSelect.name] = parseFloat($scope.newSelect.value);
      $scope.newSelect.name = "";
      $scope.newSelect.value = "";
    }

    self.filterUser = function () {
      var input, filter, table, tr, td, i, txtValue;
      input = document.getElementById("emailInput");
      filter = input.value.toUpperCase();
      table = document.getElementById("userTable");
      tr = table.getElementsByTagName("tr");
      for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[1];
        if (td) {
          txtValue = td.textContent || td.innerText;
          if (txtValue.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
          } else {
            tr[i].style.display = "none";
          }
        }
      }
    }

    self.exportUsersData = function () {
      var i;
      for (i = 0; i < self.usresArray.length; i++) {
        obj = self.usresArray[i].questions;
        var tmpString = "";
        for (var key in obj) {
          var value = obj[key];
          tmpString = tmpString + key + ": " + value + "\n";
        }
        self.usresArray[i].questions = tmpString;
      }
      JSONToCSVConvertor(self.usresArray, "USERS_INFO", true)
    }

    function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
      var i;
      for (i = 0; i < JSONData.length; i++) {
        delete JSONData[i].$$hashKey;
      }
      //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
      var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
      var CSV = 'sep=,' + '\n';
      if (ShowLabel) {
        var row = "";
        for (var index in arrData[0]) {
          row += index + ',';
        }
        row = row.slice(0, -1);
        CSV += row + '\r\n';
      }
      for (var i = 0; i < arrData.length; i++) {
        var row = "";
        for (var index in arrData[i]) {
          row += '"' + arrData[i][index] + '",';
        }
        row.slice(0, row.length - 1);
        CSV += row + '\r\n';
      }
      if (CSV == '') {
        alert("does not work with edge");
        return;
      }

      var fileName = "MyReport_";
      fileName += ReportTitle.replace(/ /g, "_");
      var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
      var link = document.createElement("a");
      link.href = uri;
      link.style = "visibility:hidden";
      link.download = fileName + ".csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    ///add from dashboard page
    self.clearTheValues = function () {
      service.umlgraph = new joint.dia.Graph;
      service.sqlEditorList = [];
      service.NFREditorList = {};
      service.nfrDefalutValue = {};
      service.classnumber = 0;
      service.allnames = [];
      $scope.projectTable = [];
      var jsonString = JSON.stringify(service.umlgraph)
      service.jsonOfProject = {
        UmlJson: jsonString,
        SqlEditor: service.sqlEditorList,
        NfrEditor: service.NFREditorList,
        ClassNumber: service.classnumber,
        NamesInUml: service.allnames,
        NFRDefalutValue: service.nfrDefalutValue,
        ComponentDefalutValue: service.componentDefalutValue
      }
      $rootScope.ProjectName = "";
      $rootScope.projectName = true;
      $rootScope.sqlEditor = true;
      $rootScope.nfrTable = true;
      $rootScope.sqlEditor = true;
      $rootScope.umlEditor = true;
      $rootScope.matrixWeight = true;
    }
    //this function extract the jsons from the backEnd
    self.Editproject = function (project) {
      service.ProjectId = project.ProjectId;
      //complete the code here , give the uml and the sql and the nfr editor his value to return the project to the editor
      self.AssignTheValues(project.ProjectJson, project.ProjectName);
      $location.path("/UMLEditor");
    }

    //this function to give the value to the editors and open it 
    self.AssignTheValues = function (jsonOfEditors, name) {
      service.jsonOfProject.UmlJson = jsonOfEditors.UmlJson
      service.jsonOfProject.SqlEditor = jsonOfEditors.SqlEditor
      service.jsonOfProject.NfrEditor = jsonOfEditors.NfrEditor
      service.jsonOfProject.ClassNumber = jsonOfEditors.ClassNumber
      service.jsonOfProject.NamesInUml = jsonOfEditors.NamesInUml
      service.jsonOfProject.NFRDefalutValue = jsonOfEditors.NFRDefalutValue
      service.jsonOfProject.ComponentDefalutValue = jsonOfEditors.ComponentDefalutValue
      service.componentDefalutValue = jsonOfEditors.ComponentDefalutValue;
      service.nfrDefalutValue = jsonOfEditors.NFRDefalutValue;
      service.umlgraph.fromJSON(JSON.parse(jsonOfEditors.UmlJson));
      service.sqlEditorList = jsonOfEditors.SqlEditor;
      service.NFREditorList = jsonOfEditors.NfrEditor;
      service.classnumber = jsonOfEditors.ClassNumber;
      service.allnames = jsonOfEditors.NamesInUml;
      $rootScope.ProjectName = name;
      $rootScope.projectName = false;
      $rootScope.sqlEditor = false;
      $rootScope.nfrTable = false;
      $rootScope.sqlEditor = false;
      $rootScope.umlEditor = false;
      $rootScope.matrixWeight = false;
      $rootScope.matrixWeight = false;

    }

    self.showParticipants = function (projectId) {
      $('#participantsModal').modal('show');
      var i;
      for (i = 0; i < $scope.projectTable.length; i++) {
        if ($scope.projectTable[i].ProjectId == projectId) {
          $scope.participantsArray = $scope.projectTable[i].Participants;
        }
      }
    }
    self.clearTheValues();

    //this function to delete the project from the backEnd
    self.DeleteProject = function (i) {
      json = {
        ProjectId: i.ProjectId,
        Participant: service.Email
      }
      $http.post('/DeleteProject', json).then(function (response) {
        self.projects();
      }, function (errResponse) {
        console.log(errResponse)
      });
    }

    self.projects();
    self.getNFRDefaultValue();

  }]);


