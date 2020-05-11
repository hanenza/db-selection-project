angular.module('myApp.controller', ['ngRoute'])
  .service('service', ['$http', "$rootScope", "$location", function ($http, $rootScope, $location) {
    self = this;
    // this varible for saving the classes from uml editor to nfr table controller , without doublicate values !!
    self.classList = [];
    self.umlgraph = new joint.dia.Graph;
    self.sqlEditorList = [];
    self.NFREditorList = {};
    self.nfrDefalutValue={};
    self.saleem = [];
    self.classnumber = 0;
    self.allnames = []
    self.UMLClassNumber = 0;
    self.queryGlobalCounter = 1;
    self.mainJson={};
    self.componentDefalutValue={}
    //was changed
    var jsonString = JSON.stringify(self.umlgraph)
    self.jsonOfProject = {
      UmlJson: jsonString,
      SqlEditor: self.sqlEditorList,
      NfrEditor: self.NFREditorList,
      ClassNumber: self.classnumber,
      NamesInUml: self.allnames,
      NFRDefalutValue:self.nfrDefalutValue,
      ComponentDefalutValue:self.componentDefalutValue
    }
    //
    self.ProjectId = -1
    $rootScope.userName = true;
    $rootScope.login = false;
    $rootScope.logout = true;
    $rootScope.register = false;
    $rootScope.about = false;
    $rootScope.adminPage = true;
    $rootScope.dashboard = true;
    $rootScope.projectName = true;
    $rootScope.sqlEditor = true;
    $rootScope.nfrTable = true;
    $rootScope.sqlEditor = true;
    $rootScope.umlEditor = true;
    $rootScope.matrixWeight = true;
    
    self.FirstName = "";
    self.LastName = "";
    self.Email = "";
    self.Password = "";
    $location.path("/Login");

  }])



