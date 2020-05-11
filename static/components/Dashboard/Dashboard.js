

angular.module("myApp.Dashboard", ['ngRoute'])

  .config([
    '$routeProvider', function ($routeProvider) {
      $routeProvider.when('/Dashboard', {
        templateUrl: 'components/Dashboard/Dashboard.html',
        controller: 'DashboardController'
      });
    }])

  .controller("DashboardController", ["$scope", "service", "$document", "$http", "$rootScope", "$window", "$location", "$route", function ($scope,
    service, $document, $http, $rootScope, $window, $location, $route) {
    // your code
    var self = $scope;
    self.ProjectIClicNow = {}
    //this array will save the project participants
    $scope.participantsArray = [];

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

    //this http request to get the projects when we refreshed the page
    self.getprojects = function () {
      var json = {
        UserName: service.Email
      }
      $http.post('/getprojects', json).then(function (response) {
        $scope.projectTable = response.data;
      }, function (errResponse) {
        console.log(errResponse);
      });
    }

    //this function to call the backEnd to share the project with another user
    self.shareproject = function () {
      var json = {
        NewParticipant: $scope.UserEmail,
        ProjectId: self.ProjectIClicNow.ProjectId
      }
      $http.post('/ShareProject', json).then(function (response) {
        self.getprojects();
      }, function (errResponse) {
        console.log(errResponse);
      });
      self.closeShareWindow();
    }

    //this function extract the jsons from the backEnd
    self.Editproject = function (project) {
      service.ProjectId = project.ProjectId
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
      $rootScope.projectName = false;
      $rootScope.ProjectName = name;
      $rootScope.sqlEditor = false;
      $rootScope.nfrTable = false;
      $rootScope.sqlEditor = false;
      $rootScope.umlEditor = false;
      $rootScope.matrixWeight = false;
      $rootScope.matrixWeight = false;
    }

    //this function to delete the project from the backEnd
    self.DeleteProject = function (i) {
      json = {
        ProjectId: i.ProjectId,
        Participant: service.Email
      }
      $http.post('/DeleteParticipant', json).then(function (response) {
        self.getprojects();
      }, function (errResponse) {
        console.log(errResponse)
      });
    }

    //this function to add new project on the DB and give the user to start build the project
    self.addNewProject = function () {
      var ProjectUsers = []
      ProjectUsers.push(service.Email);
      if ($scope.Description == undefined) {
        $scope.Description = "";
      }
      if ($scope.name == undefined) {
        $scope.name = "";
      }
      var json = {
        Participants: ProjectUsers,
        ProjectName: $scope.name,
        ProjectJson: service.jsonOfProject,
        ProjectOwner: service.Email,
        ProjectDescription: $scope.Description
      }
      $http.post('/AddNewProject', json).then(function (response) {
        self.getprojects();
      }, function (errResponse) {
        console.log(errResponse)
      });
      $scope.Description = "";
      $scope.name = "";
      self.closeAddWindow();
    }

    //this function to show the modal of add new project
    self.showAddWindowModal = function () {
      $('#addProjectModal').modal('show');
    };

    //this function to close the modal of add new project
    self.closeAddWindow = function () {
      $('#addProjectModal').modal('hide');
      golbalCounter = 0;
    };

    //this function to show the modal of add new project
    self.showShareWindowModal = function (i) {
      self.ProjectIClicNow = i;
      
      $('#shareProjectModal').modal('show');
    };

    //this function to close the modal of add new project
    self.closeShareWindow = function () {
      $('#shareProjectModal').modal('hide');
      self.ProjectIClicNow = {}
      golbalCounter = 0;
      $scope.UserEmail = "";
    };

    self.showParticipants = function (projectId,ProjectOwner) {
      $scope.projectIdForUpdate = projectId;
      for (var i = 0; i < $scope.projectTable.length; i++) {
        if ($scope.projectTable[i].ProjectId == projectId) {
          $scope.participantsArray = [];
          for (var j = 0; j < $scope.projectTable[i].Participants.length; j++) {
            if ($scope.projectTable[i].Participants[j] != ProjectOwner) {
              $scope.participantsArray.push($scope.projectTable[i].Participants[j]);
            }
          }
          if (service.Email == $scope.projectTable[i].ProjectOwner) {
            $('#adminParticipantsModal').modal('show');
          }
          else {
            $('#participantsModal').modal('show');
          }
        }
      }
    }

    self.editDescription = function (project) {
      $scope.projectNameEdit = project.ProjectName;
      $scope.projectDescriptionEdit = project.ProjectDescription;
      $scope.projectIdForUpdate = project.ProjectId;
      $('#editDescriptionModal').modal('show');
    }

    self.updateProjectDescription = function () {
      var request = { "ProjectName": $scope.projectNameEdit, "ProjectDescription": $scope.projectDescriptionEdit, "ProjectId": $scope.projectIdForUpdate }
      $http.post('/updateDescription', request).then(function (response) {
        self.getprojects();
        $('#editDescriptionModal').modal('hide');
      }, function (errResponse) {
        console.log(errResponse)
      });
    }

    self.deleteParticipant=function(participant){
      var projectId=$scope.projectIdForUpdate;
      console.log(participant);
      console.log(projectId);
    }

    self.getprojects();
    self.clearTheValues();



  }])
