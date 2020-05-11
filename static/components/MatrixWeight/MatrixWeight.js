//saleem
angular.module('myApp.MatrixWeight', ['ngRoute'])

    .config([
        '$routeProvider', function ($routeProvider) {
            $routeProvider.when('/MatrixWeight', {
                templateUrl: 'components/MatrixWeight/MatrixWeight.html',
                controller: 'MatrixWeightController'
            });
        }])

    .controller('MatrixWeightController', ["$scope", "$document", "service", "$http", "$window", function ($scope, $document, service, $http, $window) {

        //default define to our project
        self = $scope
        console.log("saleem")
        console.log(service.classList);
        $scope.classList = service.classList;
        // was changed
        self.UpdateTheJSON = function () {
            var jsonString = JSON.stringify(service.umlgraph)
            service.jsonOfProject.UmlJson = jsonString
            service.jsonOfProject.SqlEditor = service.sqlEditorList
            service.jsonOfProject.NfrEditor = service.NFREditorList
            service.jsonOfProject.NFRDefalutValue = service.nfrDefalutValue
            service.jsonOfProject.ComponentDefalutValue = service.componentDefalutValue
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

        self.getComponentDefaultValues = function () {
            if (angular.equals(service.componentDefalutValue, {})) {
                $http.post('/getComponentDefaultValues').then(function (response) {
                    console.log("saleem");
                    console.log(response.data);
                    var jsonObject = response.data;
                    for (var key in jsonObject) {
                        jsonObject[key] = jsonObject[key] * 100;
                    }
                    self.component = jsonObject;
                    service.componentDefalutValue = self.component;
                }, function (errResponse) {
                    console.log(errResponse);
                });
            }
            else {
                self.component = service.componentDefalutValue;
            }
        }

        self.getComponentDefaultValues();

        self.sendRequestNFR = function () {
            console.log({ "tableInfo": $scope.NFREditorList, "defalutValue": $scope.nfrDefalutValue });
            $http.post('/getNFR', { "tableInfo": $scope.NFREditorList, "defalutValue": $scope.nfrDefalutValue }).then(function (response) {
                genTable(response);
                $scope.matrixName = "NFR Matrix";
            }, function (errResponse) {
                console.log(errResponse);
            });
        }

        self.sendRequestSQL = function () {
            $http.post('/getSQL', getJosnForSQL()).then(function (response) {
                genTable(response);
                $scope.matrixName = "SQL Matrix";
            }, function (errResponse) {
                console.log(errResponse);
            });
        }

        self.sendRequestUML = function () {
            $http.post('/getUML', service.umlgraph).then(function (response) {
                $scope.matrixName = "UML Matrix";
                genTable(response);
            }, function (errResponse) {
                console.log(errResponse);
            });
        }

        self.sendRequestAlgorithmInput = function () {
            var sum = parseInt($scope.component.uml) + parseInt($scope.component.sql) + parseInt($scope.component.nfr);
            if (sum == 100) {
                var combineData = [];
                combineData.push(service.umlgraph);
                combineData.push(getJosnForSQL());
                combineData.push({ "tableInfo": $scope.NFREditorList, "defalutValue": $scope.nfrDefalutValue });
                combineData.push([$scope.component.uml, $scope.component.sql, $scope.component.nfr])
                $http.post('/getAlgorithmInput', combineData).then(function (response) {
                    $scope.matrixName = "Algorithm Input";
                    console.log(response);
                    genTable(response);
                }, function (errResponse) {
                    console.log(errResponse);
                });
            }
            else {
                $window.alert("Total Values Must Be Equal To 100 ,Not " + sum.toString());
            }
        }

        self.sendRequestClusters = function () {
            var sum = parseInt($scope.component.uml) + parseInt($scope.component.sql) + parseInt($scope.component.nfr);
            if (sum == 100) {
                var combineData = [];
                combineData.push(service.umlgraph);
                combineData.push(getJosnForSQL());
                combineData.push({ "tableInfo": $scope.NFREditorList, "defalutValue": $scope.nfrDefalutValue });
                combineData.push([$scope.component.uml, $scope.component.sql, $scope.component.nfr])
                $http.post('/getClusters', combineData).then(function (response) {
                    // $scope.matrixName = "Clusters";
                    // console.log(response);
                    $('#showCluster').modal('show');
                    $scope.clusterMessage = response.data;
                    // $window.alert(response.data);
                }, function (errResponse) {
                    console.log(errResponse);
                });
            }
            else {
                $window.alert("Total Values Must Be Equal To 100 ,Not " + sum.toString());
            }
        }

        self.sendRequestReslut = function () {
            var sum = parseInt($scope.component.uml) + parseInt($scope.component.sql) + parseInt($scope.component.nfr);
            if (sum == 100) {
                var combineData = [];
                combineData.push(service.umlgraph);
                combineData.push(getJosnForSQL());
                combineData.push({ "tableInfo": $scope.NFREditorList, "defalutValue": $scope.nfrDefalutValue });
                combineData.push([$scope.component.uml, $scope.component.sql, $scope.component.nfr])
                $http.post('/getResult', combineData).then(function (response) {
                    console.log(response.data);
                    $scope.resultArray = response.data;
                }, function (errResponse) {
                    console.log(errResponse);
                });
            }
            else {
                $window.alert("Total Values Must Be Equal To 100 ,Not " + sum.toString());
            }
        }

        self.showMessage = function (table) {
            console.log(table);
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
        }

        function genTable(data) {
            try {
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
            }
            catch (error) {

            }
            //show table
            var target = $document[0].getElementById('showMatrix');
            target.style.display = 'block';
        }

        self.closeMatrixWindowModal = function () {
            document.getElementById('showMatrix').style.display = 'none';
        };

        self.setDefalutValueForNewClasses = function () {
            var oldClasses = []; //saves the name of the classes in the nfr editor
            var i;
            for (var key in service.NFREditorList) {
                oldClasses.push(key)
            }
            for (i = 0; i < service.classList.length; i++) {
                if (oldClasses.indexOf(service.classList[i].name) < 0) {
                    service.NFREditorList[service.classList[i].name] = self.getDefalutJson();
                    for (var key in service.nfrDefalutValue) {
                        var min = self.getMinValue(service.nfrDefalutValue[key]);
                        service.NFREditorList[service.classList[i].name][key] = min;
                    }
                }
            }
        };


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

        self.getDefalutJson = function () {
            answer = {}
            for (var key in service.nfrDefalutValue) {
                answer["key"] = 0;
            }
            return answer;
        }


        self.updateTheNFRByTheUML = function () {
            var classListNames = [];
            var tmpNFREditorList = service.NFREditorList;
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




        self.getNFRDefaultValue();

        //this function is prepair the json for the http request to the server
        function getJosnForSQL() {
            var answer = [];
            var arr = [];
            //first arr os for classes names
            var i;
            for (i = 0; i < service.classList.length; i++) {
                arr.push(service.classList[i].name);
            }
            answer.push(arr);
            for (i = 0; i < service.sqlEditorList.length; i++) {
                answer.push(service.sqlEditorList[i]);
            }
            return answer;
        }


        self.check=function(key){
            if(key=="dbName" || key=="result"){
                return false ;
            }
            return true;
        }

    }]);