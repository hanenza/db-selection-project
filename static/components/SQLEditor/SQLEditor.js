angular.module('myApp.SQLEditor', ['ngRoute'])

  .config([
    '$routeProvider', function ($routeProvider) {
      $routeProvider.when('/SQLEditor', {
        templateUrl: 'components/SQLEditor/SQLEditor.html',
        controller: 'SQLEditorController'
      });
    }])

  .controller("SQLEditorController", ["$scope", "$document", "service", "$http", "$window", function ($scope, $document, service, $http, $window) {

    self = $scope;
    //this list will save the classes that join in the current query
    var arrSelectedClassForJoin = [];
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
    self.UpdateTheJSON()
    //

    //the type of the queries
    $scope.queryTypeList = ["select", "insert", "update", "delete", "connect"];

    //this var save the open query index ,to auto save the body(script of query)
    var indexOfOpenQuery = 0;

    //this list in saved the data from the uml graph - saved the result of uml editor "show matrix" 
    var umlData = []

    //this list contain information about user query 
    $scope.SQLQueriesList = service.sqlEditorList;

    //this var is for saving the autocomplete all word
    var categoryTags = []

    //this function insert  , selected :if the current query is part of the compution , status: saved/need save  
    self.addQuery = function () {
      //new Query structure
      var newQuery = { "name": "query" + service.queryGlobalCounter.toString(), "body": "", "selected": true, "queryType": "", "joinClass": [], "frequency": "" };
      service.queryGlobalCounter = service.queryGlobalCounter + 1
      $scope.SQLQueriesList.push(newQuery);
      //set index of the open query
      indexOfOpenQuery = $scope.SQLQueriesList.length - 1;
    };

    //*******************************************inputs handler function******************************************************* */

    //this function is responsible for deleteing the row on the table (deleteing query)
    self.deleteQuery = function (object) {
      var index = $scope.SQLQueriesList.indexOf(object);
      if (index > -1) {
        $scope.SQLQueriesList.splice(index, 1);
      }
      //if delete all query reset the default view , one row in the table header+one empty query
      if ($scope.SQLQueriesList.length == 0) {
        setFirstQuery();
      }
    };

    // copy the query text into the text area box , and update the golbal index of the open query
    self.openQuery = function (object) {
      $scope.SQLTextArea = object.body;
      indexOfOpenQuery = $scope.SQLQueriesList.indexOf(object);
      $scope.queryName = object.name;
      $scope.frequency = object.frequency;
      arrSelectedClassForJoin = object.joinClass;
      setQueryType(object.queryType);
      updateDynamicSelectjoinClass(object.joinClass);
      if ($scope.SQLTextArea.length > 0) {
        parseSQL();
      }
      else {
        $scope.message = "";
      }
      checkDisableInputs($scope.SQLTextArea);
    };

    // we call this function if the user enter again to this editor , to reload his old data
    self.setInputAttributes = function (object) {
      updateDynamicSelectjoinClass(object.joinClass);
      $scope.SQLTextArea = object.body;
      $scope.queryName = object.name;
      $scope.frequency = object.frequency;
      setQueryType(object.queryType);
      arrSelectedClassForJoin = object.joinClass;
      if ($scope.SQLTextArea.length > 0) {
        parseSQL();
      }
      else {
        $scope.message = "";
      }
      checkDisableInputs($scope.SQLTextArea);
    }

    //this function called by key up on the text area , to save the body (script) on the query automaticly , using the index of the current (opened) query
    self.saveQuery = function () {
      self.setWhiteSpaceIfItsUndifinded();
      $scope.SQLQueriesList[indexOfOpenQuery].body = $scope.SQLTextArea;
      $scope.SQLQueriesList[indexOfOpenQuery].queryType = $scope.queryType;
      $scope.SQLQueriesList[indexOfOpenQuery].frequency = $scope.frequency;
      service.sqlEditorList = $scope.SQLQueriesList;
      if ($scope.SQLTextArea.length > 0) {
        parseSQL();
      }
      else {
        $scope.message = "";
      }
      checkDisableInputs($scope.SQLTextArea);
      //this row must be after the parseSql function 
      $scope.SQLQueriesList[indexOfOpenQuery].joinClass = arrSelectedClassForJoin;
    };


    self.setWhiteSpaceIfItsUndifinded = function () {
      if ($scope.SQLTextArea == undefined) {
        $scope.SQLTextArea = "";
      }
      if ($scope.queryType == undefined) {
        $scope.queryType = "";
      }
      if ($scope.frequency == undefined) {
        $scope.frequency = "";
      }
      if ($scope.joinClass == undefined) {
        $scope.SQLQueriesList[indexOfOpenQuery].joinClass = [];
      }
    };

    //this function is update the query name
    self.updateQueryName = function (object) {
      $scope.queryName = object.name;
    };

    //if the list query is empty , add only one row , default view
    function setFirstQuery() {
      if ($scope.SQLQueriesList == 0) {
        self.addQuery();
      }
    };

    //this function to set in the html query type the cuurent query type
    function setQueryType(queryType) {
      $scope.queryType = queryType;
    };

    //this function is for updating the list of the join class by the uml graph
    function setJoinClassValues() {
      var str = "";
      for (i = 0; i < service.classList.length; i++) {
        str = str + "<option>" + service.classList[i].name + "</option>";
      }
      $("#joinClasses1").html(str)
    }

    //get the selection
    $('#joinClasses1').dblclick(function () {
      if (checkLinkBetween(arrSelectedClassForJoin, $('#joinClasses1').val()[0]) == true) {
        arrSelectedClassForJoin.push($('#joinClasses1').val()[0]);
        updateDynamicSelectjoinClass(arrSelectedClassForJoin);
        self.saveQuery();
      }
    });

    //we call this function when the user click double click in the his selected classes , to remove them
    $('#joinClasses2').dblclick(function () {
      try {
        var outClass = $('#joinClasses2').val()[0];
        var index = arrSelectedClassForJoin.indexOf(outClass);
        if (index !== -1) {
          arrSelectedClassForJoin.splice(index, 1);
        }
        updateDynamicSelectjoinClass(arrSelectedClassForJoin);
        self.saveQuery();
      }
      catch (error) {

      }
    });

    //this function is to load the values from the class selected box to user selected box --> from the 1st to 2nd
    function updateDynamicSelectjoinClass(arr) {
      var str = "";
      for (i = 0; i < arr.length; i++) {
        str = str + "<option>" + arr[i] + "</option>";
      }
      $("#joinClasses2").html(str)
    }

    //on any change on the editor call the save function
    $('body').on('change', '#editor', function () {
      self.saveQuery();
    });

    //this function is resposible for checking the linking between the classes that return after from
    function checkLinkBetween(currentArr, newValue) {
      //if we have only one class
      if (currentArr.length > 0) {
        var i;
        var legend = umlData[0];
        var data = [];
        for (i = 1; i < umlData.length; i++) {
          data.push(umlData[i]);
        }
        var flag = false;
        for (i = 0; i < currentArr.length; i++) {
          oldValue = currentArr[i];
          var indexOfOldValue = legend.indexOf(oldValue);
          var indexOfNewValue = legend.indexOf(newValue);
          if (data[indexOfOldValue][indexOfNewValue] == 1) {
            flag = true;
          }
        }
        if (flag == false) {
          $window.alert("There Is No Link Between '" + newValue + "' Class And Your Others Class.");
          return false;
        }
        return flag;
      }
      return true;
    }

    //*******************************************http request and related function******************************************************* */
    //this function is prepair the json for the http request to the server
    function getJosnReadyForHttpRequest() {
      var answer = [];
      var arr = [];
      //first arr os for classes names
      var i;
      for (i = 0; i < service.classList.length; i++) {
        arr.push(service.classList[i].name);
      }
      answer.push(arr);
      for (i = 0; i < $scope.SQLQueriesList.length; i++) {
        answer.push($scope.SQLQueriesList[i]);
      }
      return answer;
    }

    //this function is sending the http request to the server and show matrix table
    self.sendRequest = function () {
      self.UpdateTheJSON()
      $http.post('/getSQL', getJosnReadyForHttpRequest()).then(function (response) {
        service.projectSQLData = getJosnReadyForHttpRequest();
        try {
          genTable(response);
        }
        catch (error) {
        }
      }, function (errResponse) {
        console.log(errResponse);
      });
    }

    //this function is to load the data that return from the http request and load it to the modal , and open the modal
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

    //this function is for closing the show matrix modal
    self.closeMatrixWindowModal = function () {
      document.getElementById('showMatrix').style.display = 'none';
    };


    function sendRequestUML() {
      $http.post('/getUML', service.umlgraph).then(function (response) {
        umlData = response.data.data;
      }, function (errResponse) {
        console.log(errResponse);
      });
    }

    //*******************************************SQL parser and related function******************************************************* */

    //this function is responsible for - handle with inserting text in the query body --> check disable , and parse the query text and 
    //load the data in the right inputs
    function parseSQL() {
      var query = $scope.SQLTextArea.toLowerCase().split(/[ ,]+/);
      checkDisableInputs(query);
      $scope.queryType = checkQueryType(query);
      arrSelectedClassForJoin = checkQueryClasses(query);
      arrSelectedClassForJoin = deleteIrrelevantClasses(arrSelectedClassForJoin);
      updateDynamicSelectjoinClass(arrSelectedClassForJoin);
    }

    function checkIfContain(list, element) {
      try {
        for (var i = 0; i < list.length; i++) {
          if (list[i] == element) {
            return true;
          }
        }
        return false;
      }
      catch (error) {
        return false;
      }
    }

    /**
     * 
     * @param {this function get query --> string , and return the type of query(select, delete,insert,update) -->string} query 
     */
    function checkQueryType(query) {
      var queryTypeCounter = 0;
      var queryType = "";
      if (checkIfContain(query, "return")) {
        queryTypeCounter = queryTypeCounter + 1;
        queryType = "select";
      }
      if (checkIfContain(query, "insert")) {
        queryTypeCounter = queryTypeCounter + 1;
        queryType = "insert";
      }
      if (checkIfContain(query, "update")) {
        queryTypeCounter = queryTypeCounter + 1;
        queryType = "update";
      }
      if (checkIfContain(query, "delete")) {
        queryTypeCounter = queryTypeCounter + 1;
        queryType = "delete";
      }
      if (queryTypeCounter == 0) {
        return "No type was identified to your query";
      }
      else if (queryTypeCounter > 1) {
        return "Identified more than one type to your query";
      }
      else {
        return queryType;
      }
    }

    /**
     * SELECT, return password FROM user WHERE username = ? 
     * @param {sql query - string} query
     * @returns {return list of classes on the sql Query} 
     */
    function checkQueryClasses(query) {
      console.log("checkQueryClasses");
      console.log(query);
      console.log(checkIfContain(query, "insert"));
      var queryClassList = [];

      //query type --> select , check delete with 
      if (checkIfContain(query, "return")) {
        if (!checkIfContain(query, "from")) {
          return [];
        }
        queryClassList = selectQueryGetData(query);
      }

      //query type --> insert
      else if (checkIfContain(query, "insert")) {
        queryClassList = insertQueryGetData(query);
      }
      //split by comma and delete white spaces
      return queryClassList
    }

    /**
     * the input of this function is string ,the output is string that contian name of classes 
     * @param {string} query 
     */
    function selectQueryGetData(query) {
      var result = [];
      if (checkIfContain(query, "where")) {
        for (var i = query.indexOf("from") + 1; i < query.indexOf("where"); i++) {
          if (query[i] == "as") {
            i = i + 1;
            continue
          }
          result.push(query[i]);
        }
      }
      else {
        for (var i = query.indexOf("from") + 1; i < query.length; i++) {
          if (query[i] == "as") {
            i = i + 1;
            continue
          }
          result.push(query[i]);
        }
      }
      return result;
    }

    /**
     * the input of this function is string ,the output is string that contian name of classes 
     * @param {string} query 
     */
    function insertQueryGetData(query) {
      var result = [];
      //rel is doing some problem
      console.log("insert query");
      console.log(query);
      if (checkIfContain(query, "rel") && checkIfContain(query, "of") && checkIfContain(query, "where")) {
        for (var i = query.indexOf("of") + 1; i < query.indexOf("where"); i++) {
          if (query[i] == "as") {
            i = i + 1;
            continue
          }
          result.push(query[i]);
        }
      }
      else if (checkIfContain(query, "set")) {
        for (var i = query.indexOf("insert") + 1; i < query.indexOf("set"); i++) {
          if (query[i] == "as") {
            i = i + 1;
            continue
          }
          result.push(query[i]);
        }
      }
      return result;
    }

    /**
     * the input of this function is string ,the output is array that contian name of classes 
     * @param {string} query 
     */
    function splitArrayAndDeleteWhiteSpaces(query) {
      var queryClassList = query.split(',');
      var i;
      for (i = 0; i < queryClassList.length; i++) {
        //hader the case of "from class as class1"
        if (queryClassList[i].indexOf(" as") > -1) {
          queryClassList[i] = queryClassList[i].substring(0, queryClassList[i].indexOf(" as"));
        }
        queryClassList[i] = queryClassList[i].replace(/ /g, '');
      }
      return queryClassList;
    }

    //this function is responsible for disabled and abled the input of the editor --> disabled if the query body 
    function checkDisableInputs(query) {
      if (query.length > 0) {
        $('#selectQueryType').attr('disabled', 'disabled');
        $('#joinClasses1').attr('disabled', 'disabled');
        $('#joinClasses2').attr('disabled', 'disabled');
      }
      else {
        $('#selectQueryType').removeAttr('disabled');
        $('#joinClasses1').removeAttr('disabled');
        $('#joinClasses2').removeAttr('disabled');
      }
    }

    /**
     * 
     * @param {*} array - the query terms 
     */
    function deleteIrrelevantClasses(array) {
      //clear the message
      var answer = [];
      var umlClassesName = [];
      var tempString = "";
      var i;
      // preparing the uml graph classes name array
      for (i = 0; i < service.classList.length; i++) {
        umlClassesName.push(service.classList[i].name);
      }
      for (i = 0; i < array.length; i++) {
        if (umlClassesName.indexOf(array[i]) >= 0) {
          answer.push(array[i]);
        }
        else {
          tempString = tempString + array[i];
        }
      }
      if (tempString.length > 0) {
        tempString = "The Follwing Classes Does Not Exist In The UML Graph :" + tempString
      }
      $scope.message = tempString;
      return answer;
    }

    //*******************************************Auto Complete Function******************************************************* */

    // this functions is responsible for the autocomplete function and set the class digram name and attribute in the autocomplete syntax////////////////////////////////////////////////
    function textAreaSetSetting() {
      // The tags we will be looking for
      categoryTags = ["and", "as", "between", "delete", "from", "insert", "or", "return", "set", "where", "update", "connect"];
      //insert the uml class to auto complete 
      var i;
      for (i = 0; i < service.classList.length; i++) {
        categoryTags.push(service.classList[i].name);
        categoryTags.push(service.classList[i].name + ".all");
        for (var j = 0; j < service.classList[i].attributes.length; j++) {
          categoryTags.push(service.classList[i].name + "." + service.classList[i].attributes[j]);
        }
      }
      // State variable to keep track of which category we are in
      tagState = categoryTags;
      // Helper functions
      function split(val) {
        return val.split(' ');
      }
      function extractLast(term) {
        return split(term).pop();
      }
      $("#SQLTextAreaId")
        // Create the autocomplete box
        .autocomplete({
          minLength: 0,
          autoFocus: true,
          source: function (request, response) {
            // Use only the last entry from the textarea (exclude previous matches)
            lastEntry = extractLast(request.term);

            var filteredArray = $.map(tagState, function (item) {
              if (item.indexOf(lastEntry) === 0) {
                return item;
              } else {
                return null;
              }
            });
            // delegate back to autocomplete, but extract the last term
            response($.ui.autocomplete.filter(filteredArray, lastEntry));
          },
          focus: function () {
            // prevent value inserted on focus
            return false;
          },
          select: function (event, ui) {
            var terms = split(this.value);
            // remove the current input
            terms.pop();
            // add the selected item
            terms.push(ui.item.value);
            // add placeholder to get the comma-and-space at the end
            terms.push("");
            this.value = terms.join(" ");
            return false;
          }
        }).on("keydown", function (event) {
          // don't navigate away from the field on tab when selecting an item
          if (event.keyCode === $.ui.keyCode.TAB /** && $(this).data("ui-autocomplete").menu.active **/) {
            event.preventDefault();
            return;
          }
        });
    };

    //*******************************************main - every controller load function******************************************************* */
    //the main -- all function calls after document ready
    $(document).ready(function () {
      textAreaSetSetting();
      setJoinClassValues();
      if ($scope.SQLQueriesList.length > 0) {
        self.setInputAttributes($scope.SQLQueriesList[0]);
      }
      else {
        setFirstQuery();
      }
      sendRequestUML();
    });

  }]);


