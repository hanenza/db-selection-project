
//12-4-2020
angular.module("myApp.UMLEditor", ['ngRoute'])

.config([
  '$routeProvider', function ($routeProvider) {
    $routeProvider.when('/UMLEditor', {
      templateUrl: 'components/UMLEditor/UMLEditor.html',
      controller: 'UMLEditorController'
    });
  }])

.controller("UMLEditorController", ["$scope", "$document", "$window", "$http", "service", function ($scope, $document, $window, $http, service) {

  var self = $scope;
  //array of the names 
  self.allnames = service.allnames;
  //defult class number
  var classnumber = service.classnumber;
  //for links between class to build the graph
  self.linksBclass = [];
  //for saving the attribute array
  self.attributeArray = [];
  // list that contain all element in the graph
  self.allElement = []
  // the uml var , using this var we import our class from the package
  var uml = joint.shapes.uml;
  $scope.links = ['Association', 'Aggregation', 'Generalization', 'Composition'];
  // temp var for the edit classes modal
  var golbalCounter = 0;
  //this var is define if the creation modal is open
  self.classModalOpen = false;
  //this var to hold the link whos i clicked on and i want to write text 
  var theLinkIclickNow = null;
  //this to check if i click on link to the association class
  $scope.isAssociationClass = false
  //to check if the link was deleted
  wasdeleted = false;
  //this var save the information about the current element for editing , very important var
  currentElement = null;
  //for element link
  ElementLinkTarget = null;
  ElementLinkSourse = null;
  TheOldName = ''
  // the graph , the main window in the uml editor
  var graph = service.umlgraph;
  var jsonString = JSON.stringify(graph)
  graph.fromJSON(JSON.parse(jsonString))
  // was changed
  self.UpdateTheJSON=function(){
    jsonString = JSON.stringify(service.umlgraph)
    service.jsonOfProject.UmlJson=jsonString
    service.jsonOfProject.SqlEditor=service.sqlEditorList
    service.jsonOfProject.NfrEditor=service.NFREditorList
    service.jsonOfProject.NFRDefalutValue = service.nfrDefalutValue
    service.jsonOfProject.ComponentDefalutValue=service.componentDefalutValue
    service.jsonOfProject.ClassNumber=service.classnumber
    service.jsonOfProject.NamesInUml=service.allnames
    var json={
      ProjectJson:service.jsonOfProject,
      ProjectId:service.ProjectId
    }
    $http.post('/UpdateProjectJson', json).then(function (response) {
      try {
        console.log(response)
      }
      catch (error) {
        console.log(error);
      }
    }, function (errResponse) {
    });
  }
  self.UpdateTheJSON()
  //
  // we define the dimensions of the graph ,height, wight

  var paper = new joint.dia.Paper({ el: $('#myholder'), width: 1200, height: 600, gridSize: 1, model: graph });

  var jsonString1 = JSON.stringify(service.umlgraph)
  graph.fromJSON(JSON.parse(jsonString1))
  $scope.modalStyle = {
    "position": "absolute",
    "left": "20%",
    "top": "50%",
    "margin-left": "-150px",
    "margin-top": "-150px"
  }
  /**
   * this siction to create the elements and the link to the graph
   */
  // this function for the linking between the class | need implementaion by Ibrahim
  self.linkit = function () {
    if ($scope.selectedLink == 'Aggregation') {
      var link = new uml.Aggregation({ source: { id: ElementLinkSourse.model.id }, target: { id: ElementLinkTarget.model.id } })
    } else {
      if ($scope.selectedLink == 'Generalization') {
        var link = new uml.Generalization({ source: { id: ElementLinkSourse.model.id }, target: { id: ElementLinkTarget.model.id }, })
      } else {
        if ($scope.selectedLink == 'Composition') {
          var link = new uml.Composition({ source: { id: ElementLinkSourse.model.id }, target: { id: ElementLinkTarget.model.id }, })
        }
        else {
          var link = new uml.Association({ source: { id: ElementLinkSourse.model.id }, target: { id: ElementLinkTarget.model.id }, })
        }
      }
    }
    //noticed the order of the appendlabel important you have to know where you but the text of every one on the array
    link.appendLabel({
      attrs: {
        text: {
          text: '',
          'font-size': 10
        }
      },
      position: {
        distance: 0.9
      }
    });
    link.appendLabel({
      attrs: {
        text: {
          text: '',
          'font-size': 10
        }
      },
      position: {
        distance: 0.5
      }
    });
    link.appendLabel({
      attrs: {
        text: {
          text: '',
          'font-size': 10
        }
      },
      position: {
        distance: 0.1
      }
    });
    link.appendLabel({
      attrs: {
        text: {
          text: '',
          'font-size': 10
        }
      },
      position: {
        distance: 0.25
      }
    });
    link.appendLabel({
      attrs: {
        text: {
          text: '',
          'font-size': 10
        }
      },
      position: {
        distance: 0.75
      }
    });
    graph.addCell(link);
    service.umlgraph = graph;
    buildTheJsonForUML();
    ElementLinkSourse = null;
    ElementLinkTarget = null;
  };


  // this function is for creating a class in the corner of the graph 
  self.createDefault = function () {
    classnumber = classnumber + 1
    var classname = "class" + classnumber.toString()
    var defaultClass = new uml.Class({
      position: { x: 1123, y: 0 },
      size: { width: 75, height: 50 },
      name: classname,
      attributes: [],
      attrs: {
        '.uml-class-name-rect': {
          fill: '#ff8450',
          stroke: '#fff',
          'stroke-width': 0.5
        },
        '.uml-class-attrs-rect': {
          fill: '#fe976a',
          stroke: '#fff',
          'stroke-width': 0.5
        },
        '.uml-class-methods-rect': {
          fill: '#fe976a',
          stroke: '#fff',
          'stroke-width': 0
        },
        '.uml-class-attrs-text': {
          'ref-y': 0.5,
          'y-alignment': 'middle',
          fontSize: 10
        },
        '.uml-class-methods-text': {
          'ref-y': 0,
          'y-alignment': 'middle',
          fontSize: 0
        },
        '.uml-class-name-text': {
          'ref-y': 0.5,
          'y-alignment': 'middle',
          fontSize: 10
        },
      }
    })
    defaultClass.attributes.isdefault = true;
    defaultClass.attributes.classnumber=classnumber
    graph.addCell(defaultClass);
    service.umlgraph = graph;
    buildTheJsonForUML();
  };

      //this loop for creation 30 classes in the corner => to implementaion the drag and drop
      self.createDefault();

  //this function is for creating a class in a random position on the graph , we called this functions by clicking the submit into the multiclass button
  self.createClass = function () {
    self.showingMultiClassCreationModal();
    self.classModalOpen = true;
    $scope.ElementType = 'Class';
    $scope.creationName = 'Class';
    currentElement = new uml.Class({
      position: { x: Math.floor(Math.random() * 500), y: Math.floor(Math.random() * 500) },
      size: { width: 75, height: 50 },
      name: $scope.elementName,
      attributes: self.attributeArray,
      attrs: {
        '.uml-class-name-rect': {
          fill: '#ff8450',
          stroke: '#fff',
          'stroke-width': 0.5
        },
        '.uml-class-attrs-rect': {
          fill: '#fe976a',
          stroke: '#fff',
          'stroke-width': 0.5
        },
        '.uml-class-methods-rect': {
          fill: '#fe976a',
          stroke: '#fff',
          'stroke-width': 0
        },
        '.uml-class-attrs-text': {
          'ref-y': 0.5,
          'y-alignment': 'middle',
          fontSize: 10
        },
        '.uml-class-methods-text': {
          'ref-y': 0,
          'y-alignment': 'middle',
          fontSize: 0
        },
        '.uml-class-name-text': {
          'ref-y': 0.5,
          'y-alignment': 'middle',
          fontSize: 10
        },
      }
    })
    currentElement.attributes.isdefault = false;
  };
  /**
   * this function i think you can delete it...
   */
  //this function is creationg a class that his name , attribute and position were taken in the args
  self.copyClass = function (name, attributes, position) {
    $scope.ElementType = 'Class';
    $scope.creationName = 'Class';
    var copyClass = new uml.Class({
      position: position,
      size: { width: 75, height: 50 },
      name: name,
      attributes: attributes,
      attrs: {
        '.uml-class-name-rect': {
          fill: '#ff8450',
          stroke: '#fff',
          'stroke-width': 0.5
        },
        '.uml-class-attrs-rect': {
          fill: '#fe976a',
          stroke: '#fff',
          'stroke-width': 0.5
        },
        '.uml-class-methods-rect': {
          fill: '#fe976a',
          stroke: '#fff',
          'stroke-width': 0
        },
        '.uml-class-attrs-text': {
          'ref-y': 0.5,
          'y-alignment': 'middle',
          fontSize: 10
        },
        '.uml-class-methods-text': {
          'ref-y': 0,
          'y-alignment': 'middle',
          fontSize: 0
        },
        '.uml-class-name-text': {
          'ref-y': 0.5,
          'y-alignment': 'middle',
          fontSize: 10
        },
      }
    })
    graph.addCell(copyClass);
    service.umlgraph = graph;
    buildTheJsonForUML();
  };
  /**
   * end of the siction
   */
  /**
   * this siction all the function was called by the edit model without the delete function ( in the delete siction)
   */
  /**
   * this siction to the 4 botton thats give the element to invrease and decrease
   * the 4 function called by the model edit model
   */
  self.increaseheight = function () {
    var elem = graph.getCell(currentElement.model.id)
    
    //console.log(paper)
    elem.attributes.size.height = elem.attributes.size.height + 10
    var jsonString = JSON.stringify(graph)
    graph.fromJSON(JSON.parse(jsonString))
    elem = graph.getCell(currentElement.model.id)
    currentElement.model=elem
    service.umlgraph = graph;
    buildTheJsonForUML();
  }
  self.increasewidth = function () {
    var elem = graph.getCell(currentElement.model.id)
    elem.attributes.size.width = elem.attributes.size.width + 10
    var jsonString = JSON.stringify(graph)
    graph.fromJSON(JSON.parse(jsonString))
    elem = graph.getCell(currentElement.model.id)
    currentElement.model=elem
    service.umlgraph = graph;
    buildTheJsonForUML();
  }
  self.decreasewidth = function () {
    var elem = graph.getCell(currentElement.model.id)
    elem.attributes.size.width = elem.attributes.size.width - 10
    var jsonString = JSON.stringify(graph)
    graph.fromJSON(JSON.parse(jsonString))
    elem = graph.getCell(currentElement.model.id)
    currentElement.model=elem
    service.umlgraph = graph;
    buildTheJsonForUML();
  }
  self.decreaseheight = function () {
    var elem = graph.getCell(currentElement.model.id)
    elem.attributes.size.height = elem.attributes.size.height - 10
    var jsonString = JSON.stringify(graph)
    graph.fromJSON(JSON.parse(jsonString))
    elem = graph.getCell(currentElement.model.id)
    currentElement.model=elem
    service.umlgraph = graph;
    buildTheJsonForUML();
  }
  /**
   * end the siction of the 4 fun
   */
  // the function is add input for new attribute in the edit window modal
  self.addAttributeInput = function () {
    var myElements = document.querySelector('#addingAttributeInputs');
    var input = document.createElement("INPUT");
    input.setAttribute("style", "width:170px; height:14px ;display:block;margin-top:0px;");
    input.setAttribute("type", "text");
    input.setAttribute("value", "");
    input.setAttribute("ng-model", "attributeSaleem");
    input.setAttribute("id", "tempId" + golbalCounter);
    // the golbalCounter is count how many inputs the user adding in this window modal
    golbalCounter = golbalCounter + 1;
    myElements.append(input);
  }
  // this function is called after click in the updating class in the edit class modal , using this function we update the class 
  self.updateClass = function () {
    // the biglist will contian the current class attributes with the new class attributes
    if (!self.allnames.includes($scope.name) || $scope.name == TheOldName) {
      self.allnames.push($scope.name)
      service.allnames=self.allnames
      self.deletefromthearray(TheOldName)
      TheOldName = ''
    } else {
      $window.alert("The name is exist")
      return
    }
    var bigList = []
    var i;
    // the attibuteInputs list is contaion the old attribute for the class
    for (i = 0; i < $scope.attributesInputs.length; i++) {
      if ($scope.attributesInputs[i].l != undefined && $scope.attributesInputs[i].l != "")
        bigList.push($scope.attributesInputs[i].l);
    }
    var temp = currentElement.model.attributes.attributes.length;
    for (i = 0; i < golbalCounter + temp; i++) {
      if (angular.element(document.querySelector('#tempId' + i)).val() != undefined && angular.element(document.querySelector('#tempId' + i)).val() != '') {
        if (bigList.indexOf(angular.element(document.querySelector('#tempId' + i)).val()) < 0) {
          bigList.push(angular.element(document.querySelector('#tempId' + i)).val());
        }
      }
    }
    currentElement.model.attributes.attributes = bigList;
    currentElement.model.attributes.name = $scope.name;
    var jsonString = JSON.stringify(graph)
    graph.fromJSON(JSON.parse(jsonString))
    service.umlgraph = graph;
    buildTheJsonForUML();
    self.closeEditWindow();
  }
  /**
   * end of the edit function siction
   */
  // this function is deleting all the attributes inputs from the edit window modal 
  function deleteAllAttributesInputs() {
    var myElements = document.querySelector('#addingAttributeInputs');
    try {
      while (true) {
        myElements.removeChild(myElements.childNodes[0]);
      }
    }
    catch (error) {
    }
  };

  // this function is for adding attribute for class into the multiclass creation window
  self.addAttribute = function () {
    //if the modal is open 
    if (self.classModalOpen) {
      //check if the element not inside the list
      if (self.attributeArray.indexOf($scope.attribute) == -1) {
        self.attributeArray.push($scope.attribute);
        var i;
        var tmp = [];
        tmp.push('Attribute:   ');
        for (i = 0; i < self.attributeArray.length; i++) {
          if (i != self.attributeArray.length - 1) {
            tmp.push(i + ") " + self.attributeArray[i] + "  ,");
          }
          else {
            tmp.push(i + ") " + self.attributeArray[i] + "  .");
          }
        }
        $scope.attributeArray = tmp;
      }
    }
  };
  /**
   * this section caled by click on create on the class modal and create the class
   */
  //this function is for the submit button in the multiclass creation window modal
  self.submit = function () {
    if (self.classModalOpen) {
      if (!self.allnames.includes($scope.elementName)) {
        self.allnames.push($scope.elementName)
        service.allnames=self.allnames
        self.createClass();
      } else {
        $window.alert("This Name is exist");
        return
      }
    }
    graph.addCell(currentElement);
    service.umlgraph = graph;
    buildTheJsonForUML();
    self.allElement.push(currentElement);
    self.clearAllFields();
  };
  //this for submit the assoceation class
  self.submitAssoceationClass = function () {
    if (self.classModalOpen) {
      if (!self.allnames.includes($scope.elementName)) {
        self.allnames.push($scope.elementName)
        service.allnames=self.allnames
        self.createClass();
      } else {
        $window.alert("This Name is exist");
        return
      }
    }
    //extract the id of the source and the target of the link and the element of this ids
    var sourceId = theLinkIclickNow.attributes.source.id;
    var targetId = theLinkIclickNow.attributes.target.id;
    var elementOfSource = graph.getCell(sourceId)
    var elementOfTarget = graph.getCell(targetId)
    //change the type of the elements to know thats related with a a class association
    elementOfSource.attributes.mytype = elementOfSource.attributes.type + "-withclassossociation"
    elementOfTarget.attributes.mytype = elementOfTarget.attributes.type + "-withclassossociation"
    //change the type of the class assoceation to classassociation
    currentElement.attributes.mytype = "Class-Association"
    //create the point
    var point = new joint.shapes.basic.Circle({
      size: { width: 20, height: 20 },
      attrs: { text: { text: '' }, circle: { fill: '#2ECC71' } },
    });
    var x = Math.abs((elementOfSource.attributes.position.x + elementOfTarget.attributes.position.x) / 2);
    var y = Math.abs((elementOfSource.attributes.position.y + elementOfTarget.attributes.position.y) / 2);
    point.position(x, y);
    point.attributes.texts = theLinkIclickNow.attributes.labels;
    // add to the point the id to the 2 elements and the class assoceation 
    point.attributes.elementSourceId = sourceId;
    point.attributes.elementTargetId = targetId;
    point.attributes.elementClassAssoceationId = currentElement.id;
    //add to the class assoceation the id to the point
    currentElement.attributes.pointId = point.id;
    //add to the  2 element the id of the point
    elementOfSource.attributes.pointId = point.id
    elementOfTarget.attributes.pointId = point.id
    //creation the links
    var link1 = new uml.Association({ source: { id: sourceId }, target: { id: point.id }, })
    var link2 = new uml.Association({ source: { id: targetId }, target: { id: point.id }, })
    var link = new uml.Implementation({ source: { id: point.id }, target: { id: currentElement.id }, })
    //copy the writen text and number on the old link to the new links
    link1.appendLabel({
      attrs: {
        text: {
          text: theLinkIclickNow.attributes.labels[2].attrs.text.text,
          'font-size': 10
        }
      },
      position: {
        distance: 0.1
      }
    });
    link1.appendLabel({
      attrs: {
        text: {
          text: theLinkIclickNow.attributes.labels[3].attrs.text.text,
          'font-size': 10
        }
      },
      position: {
        distance: 0.5
      }
    });
    link1.appendLabel({
      attrs: {
        text: {
          text: theLinkIclickNow.attributes.labels[1].attrs.text.text,
          'font-size': 10
        }
      },
      position: {
        distance: 0.9
      }
    });
    link2.appendLabel({
      attrs: {
        text: {
          text: theLinkIclickNow.attributes.labels[4].attrs.text.text,
          'font-size': 10
        }
      },
      position: {
        distance: 0.5
      }
    });
    link2.appendLabel({
      attrs: {
        text: {
          text: theLinkIclickNow.attributes.labels[0].attrs.text.text,
          'font-size': 10
        }
      },
      position: {
        distance: 0.1
      }
    });
    point.attributes.link1 = link1.id
    point.attributes.link2 = link2.id
    point.attributes.linkAssociation = link.id
    //add all the new elements (class assoceation, point bettwen the class and 2 element , 3 links to connect bettwen them )
    graph.addCell(currentElement);
    graph.addCell(point);
    graph.addCell(link1);
    graph.addCell(link2);
    graph.addCell(link);
    graph.getCell(theLinkIclickNow.id).remove();
    service.umlgraph = graph;
    buildTheJsonForUML();
    self.closeCreationAssociationModal();
    self.allElement.push(currentElement);
    self.clearAllFields();
  };
  /**
   * open the modals
   */
  // this function is called from the html function when the user click on the class button above the graph
  self.openMultiClassCreationModal = function () {
    self.showingMultiClassCreationModal();
    self.classModalOpen = true;
    $scope.ElementType = 'Class';
    $scope.creationName = 'Class';
  };
  //this called tho function to open the modal of creating class to create the association class
  self.openClassCreationModal = function () {
    self.closelinkWindow();
    self.showingClassCreationModal();
    self.classModalOpen = true;
    $scope.ElementType = 'Class';
    $scope.creationName = 'Class';
  };
  //this function for showing the modal window , creation modal window
  self.showingMultiClassCreationModal = function () {
    var target = $document[0].getElementById('ClassModal');
    target.style.display = 'block';
  };
  //this function for showing th modal of creatin the assosiation class
  self.showingClassCreationModal = function () {
    var target = $document[0].getElementById('ClassModal');
    target.style.display = 'block';
  };

  //this function for showing the modal window ,editing modal window
  self.showEditWindowModal = function () {
    var target = $document[0].getElementById('editModal');
    target.style.display = 'block';
    deleteAllAttributesInputs();
  };
  //this function for shoing the modal window , thi modal give the user to write on the link 
  self.showLinkWindowModal = function () {
    var target = $document[0].getElementById('linkModal');
    target.style.display = 'block';
    deleteAllAttributesInputs();
  };

  // this function close the creation modal and 
  self.closeCreationModal = function () {
    document.getElementById('multiClassModal').style.display = 'none';
    self.clearAllFields();
    self.classModalOpen = false;
    self.interfaceModalOpen = false;
    self.abstractModalOpen = false;
  };
  //this function close the creation assosiation calss modal
  self.closeCreationAssociationModal = function () {
    document.getElementById('ClassModal').style.display = 'none';
    self.clearAllFields();
    self.classModalOpen = false;
    self.interfaceModalOpen = false;
    self.abstractModalOpen = false;
  };

  // this function is close the edit window modal
  self.closeEditWindow = function () {
    if ($scope.name != '') {
      document.getElementById('editModal').style.display = 'none';
      golbalCounter = 0;
    }
    else {
      window.alert("Please , Enter Name For The Class");
    }
  };
  self.closelinkWindow = function () {
    document.getElementById('linkModal').style.display = 'none';
  };

  // this functions is clear all vars and got the uml editor to inital mode
  self.clearAllFields = function () {
    $scope.attribute = '';
    $scope.elementName = '';
    self.attributeArray = [];
    //for elemnt detalis
    currentElement = null;
    $scope.attributeArray = []
  };

  // we called this functions to before start the uml editor window
  self.showEditWindowModal();
  self.closeEditWindow();

  paper.on({
    'element:contextmenu': onElementRightClick
  });

  paper.on({
    'element:pointerdblclick': doubleementClick
  });
  paper.on({
    'link:contextmenu': LinkRightClick
  });
  graph.on('change:position', function (element) {

    if (element.attributes.isdefault) {
      self.addtonames(element)
      buildTheJsonForUML();
    }
    service.umlgraph = graph;
    
  });
  graph.on('remove', function (cell, collection, opt) {
    if (cell.isLink()) {
      self.checkthekindofthelinkTodelete(cell)
    }
  });
  //this function to add the name to the array of names 
  self.addtonames = function (element) {
    self.allnames.push(element.attributes.name);
    service.allnames=self.allnames
    //console.log(element)
    element.attributes.isdefault = false;
    service.classnumber=classnumber
    //classnumber=element.attributes.classnumber+1
    self.createDefault()
  }
  //this function to open the model to give the user to write on the link 
  function LinkRightClick(elementView) {
    var link = elementView.model
    theLinkIclickNow = link;
    var sourceId = link.attributes.source.id;
    var targetId = link.attributes.target.id;
    var elementOfSource = graph.getCell(sourceId)
    var elementOfTarget = graph.getCell(targetId)
    var sourceName = elementOfSource.attributes.name
    var targetName = elementOfTarget.attributes.name
    document.getElementById("source").placeholder = sourceName;
    document.getElementById("target").placeholder = targetName;
    //condition to check the kind of the link
    if (elementOfSource.attributes.type == 'basic.Circle' || elementOfTarget.attributes.type == 'basic.Circle') {
      self.linkOfassociationclass(elementOfSource, elementOfTarget);
    } else {
      self.UsualLink();
    }

  }
  //prepare the link 
  self.UsualLink = function () {
    $scope.targetT = theLinkIclickNow.attributes.labels[4].attrs.text.text
    $scope.sourceT = theLinkIclickNow.attributes.labels[3].attrs.text.text
    $scope.sourceN = theLinkIclickNow.attributes.labels[2].attrs.text.text
    $scope.mytext = theLinkIclickNow.attributes.labels[1].attrs.text.text
    $scope.targetN = theLinkIclickNow.attributes.labels[0].attrs.text.text
    self.showLinkWindowModal();
  }
  //prepare the association link
  self.linkOfassociationclass = function (elementOfSource, elementOfTarget) {
    if (elementOfTarget.attributes.mytype == "Class-Association" || elementOfSource.attributes.mytype == "Class-Association") {
      $window.alert("cant write on this link")
      return
    }

    if (elementOfSource.attributes.type == 'basic.Circle') {

      var point = elementOfSource

    } else {
      var point = elementOfTarget
    }
    var elementS = graph.getCell(point.attributes.elementSourceId)
    var elementT = graph.getCell(point.attributes.elementTargetId)
    var sourceName = elementS.attributes.name
    var targetName = elementT.attributes.name
    document.getElementById("source").placeholder = sourceName;
    document.getElementById("target").placeholder = targetName;
    var link1 = graph.getCell(point.attributes.link1)
    var link2 = graph.getCell(point.attributes.link2)
    $scope.targetT = point.attributes.texts[4].attrs.text.text
    $scope.sourceT = point.attributes.texts[3].attrs.text.text
    $scope.sourceN = point.attributes.texts[2].attrs.text.text
    $scope.mytext = point.attributes.texts[1].attrs.text.text
    $scope.targetN = point.attributes.texts[0].attrs.text.text
    self.showLinkWindowModal();
  };
  //check the kind of the link to write on the link
  self.checkthekindofthelink = function () {
    var sourceId = theLinkIclickNow.attributes.source.id;
    var targetId = theLinkIclickNow.attributes.target.id;
    var elementOfSource = graph.getCell(sourceId)
    var elementOfTarget = graph.getCell(targetId)
    if (elementOfSource.attributes.type == 'basic.Circle' || elementOfTarget.attributes.type == 'basic.Circle') {
      self.writeontheassolink(elementOfSource, elementOfTarget);
    } else {
      self.writeonthelink();
    }
  };
  //write on the associaton link
  self.writeontheassolink = function (elementOfSource, elementOfTarget) {
    if (elementOfSource.attributes.type == 'basic.Circle') {
      var point = elementOfSource

    } else {
      var point = elementOfTarget
    }
    point.attributes.texts[4].attrs.text.text = $scope.targetT;
    point.attributes.texts[3].attrs.text.text = $scope.sourceT
    point.attributes.texts[2].attrs.text.text = $scope.sourceN
    point.attributes.texts[1].attrs.text.text = $scope.mytext
    point.attributes.texts[0].attrs.text.text = $scope.targetN
    var link1 = graph.getCell(point.attributes.link1)
    var link2 = graph.getCell(point.attributes.link2)
    link2.attributes.labels[0].attrs.text.text = $scope.targetT;
    link1.attributes.labels[1].attrs.text.text = $scope.sourceT;
    link1.attributes.labels[0].attrs.text.text = $scope.sourceN;
    link1.attributes.labels[2].attrs.text.text = $scope.mytext;
    link2.attributes.labels[1].attrs.text.text = $scope.targetN;
    var jsonString = JSON.stringify(graph)
    graph.fromJSON(JSON.parse(jsonString))
    service.umlgraph = graph;
    buildTheJsonForUML();
    self.closelinkWindow();
  };
  //write on the usual link
  self.writeonthelink = function () {
    theLinkIclickNow.attributes.labels[4].attrs.text.text = $scope.targetT;
    theLinkIclickNow.attributes.labels[3].attrs.text.text = $scope.sourceT;
    theLinkIclickNow.attributes.labels[2].attrs.text.text = $scope.sourceN;
    theLinkIclickNow.attributes.labels[1].attrs.text.text = $scope.mytext;
    theLinkIclickNow.attributes.labels[0].attrs.text.text = $scope.targetN;
    var jsonString = JSON.stringify(graph)
    graph.fromJSON(JSON.parse(jsonString))
    service.umlgraph = graph;
    buildTheJsonForUML();
    self.closelinkWindow();
  };
  //check the kind of the link to delete the association class
  self.checkthekindofthelinkTodelete = function (mylink) {
    
    var sourceId = mylink.attributes.source.id;
    var targetId = mylink.attributes.target.id;
    var elementOfSource = graph.getCell(sourceId)
    var elementOfTarget = graph.getCell(targetId)
    //changed
    if(elementOfSource==null||elementOfTarget==null){
      return
    }
    //
    if (elementOfSource.attributes.type == 'basic.Circle' || elementOfTarget.attributes.type == 'basic.Circle') {
      if (elementOfSource.attributes.type == 'basic.Circle') {
        var point = elementOfSource
        var myelement = elementOfTarget
      } else {
        var point = elementOfTarget
        var myelement = elementOfSource
      }
      self.deleteTheAssociationAndThepointbyLink(point, myelement);
    } else {
    }
  };
  //this function to delete  the association class after the link was deleted 
  self.deleteTheAssociationAndThepointbyLink = function (thepoint, myelement) {
    //Class-Association
    //extract the 2 elements
    var elementOfSource = graph.getCell(thepoint.attributes.elementSourceId)
    var elementOfTarget = graph.getCell(thepoint.attributes.elementTargetId)
    //console.log(elementOfSource)
    //console.log(elementOfTarget)
    //change the type of the tow elements to umlclass
    elementOfSource.attributes.mytype = 'uml.Class'
    elementOfTarget.attributes.mytype = 'uml.Class'
    //remove the point and the associaton class and return to the last situation
    if (myelement.attributes.mytype == 'Class-Association') {
      self.buildTheLink(thepoint);
      myelement=graph.getCell(myelement.id)
      graph.getCell(myelement.cid).remove();
      self.deletefromthearray(myelement.attributes.name);
      service.umlgraph = graph
      buildTheJsonForUML();
    }
    graph.getCell(thepoint).remove();
  }
  //delete the association class
  //to close the link model
  self.closelinkWindow = function () {
    document.getElementById('linkModal').style.display = 'none';
    $scope.sourceN = ''
    $scope.mytext = ''
    $scope.targetN = ''
    $scope.targetT = ''
    $scope.sourceT = ''
    $scope.isAssociationClas = false;
  };
  //this function to prepare the target and source and send to the link function
  function doubleementClick(elementView) {
    if (elementView.model.attributes.isdefault) {
      return
    }
    if (ElementLinkSourse == null) {

      elementView.highlight();
      ElementLinkSourse = elementView;
    } else {
      ElementLinkTarget = elementView;
      ElementLinkSourse.unhighlight();
      self.linkit();
    }
  }
  // this function is two showing the edit class window by click right click right click on any class
  function onElementRightClick(elementView) {
    if (elementView.model.attributes.isdefault) {
      return
    }
    $scope.modalStyle = {
      "position": "absolute",
      "left": Number(event.clientX) + 50 + "px",
      "top": Number(event.clientY) + 100 + "px",
      "margin-left": "-150px",
      "margin-top": "-150px"
    }
    currentElement = elementView;
    setInputs(elementView);
    self.showEditWindowModal();
  }

  // this function is for set the class attribute inputs in the edit window modal
  setInputs = function (elementView) {
    $scope.name = elementView.model.attributes.name;
    TheOldName = elementView.model.attributes.name;
    var i;
    var tmp = [];
    for (i = 0; i < elementView.model.attributes.attributes.length; i++) {
      var str = { "l": elementView.model.attributes.attributes[i] };
      tmp.push(str);
    }
    $scope.attributesInputs = tmp;
    // this function is to update the view of the updaing modal , we should call applay to refresh th view 
    $scope.$apply();
  }

  // this function is delete the current element var from the graph
  self.deleteElement = function () {
    if (currentElement.model.attributes.mytype == 'uml.Class-withclassossociation') {
      //wasdeleted=true;
      var thepoint = graph.getCell(currentElement.model.attributes.pointId)
      graph.getCell(thepoint.attributes.linkAssociation).remove()
    }

    if (currentElement.model.attributes.mytype == 'Class-Association') {
      var thepoint = graph.getCell(currentElement.model.attributes.pointId)
      graph.getCell(thepoint.attributes.linkAssociation).remove()
      self.closeEditWindow();
      return
    }
    graph.getCell(currentElement.model.cid).remove();
    self.deletefromthearray(currentElement.model.attributes.name);
    service.umlgraph = graph
    buildTheJsonForUML();
    //currentElement.remove();
    self.closeEditWindow();
  };
  /**
   * this function to delete the name from the array of the names
   */
  self.deletefromthearray = function (thename) {
    if (self.allnames[self.allnames.length - 1] == thename) {
      self.allnames.pop();
      return;
    }
    for (var i = 0; i < self.allnames.length - 1; i++) {
      if (self.allnames[i] == thename) {
        self.allnames[i] = self.allnames[self.allnames.length - 1]
        self.allnames.pop();
        return;
      }
    }
    service.allnames=self.allnames
  }

  self.sendRequest = function () {
    $http.post('/getUML', graph).then(function (response) {
      try {
        genTable(response);
      }
      catch (error) {
        console.log(error);
      }
    }, function (errResponse) {
    });
  }

  //prepar and add the link
  self.buildTheLink = function (thepoint) {
    var link = new uml.Association({ source: { id: thepoint.attributes.elementSourceId }, target: { id: thepoint.attributes.elementTargetId }, })
    link.appendLabel({
      attrs: {
        text: {
          text: thepoint.attributes.texts[0].attrs.text.text,
          'font-size': 10
        }
      },
      position: {
        distance: 0.9
      }
    });
    link.appendLabel({
      attrs: {
        text: {
          text: thepoint.attributes.texts[1].attrs.text.text,
          'font-size': 10
        }
      },
      position: {
        distance: 0.5
      }
    });
    link.appendLabel({
      attrs: {
        text: {
          text: thepoint.attributes.texts[2].attrs.text.text,
          'font-size': 10
        }
      },
      position: {
        distance: 0.1
      }
    });
    link.appendLabel({
      attrs: {
        text: {
          text: thepoint.attributes.texts[3].attrs.text.text,
          'font-size': 10
        }
      },
      position: {
        distance: 0.25
      }
    });
    link.appendLabel({
      attrs: {
        text: {
          text: thepoint.attributes.texts[4].attrs.text.text,
          'font-size': 10
        }
      },
      position: {
        distance: 0.75
      }
    });
    //changed
     var jsonString = JSON.stringify(graph)
     graph.fromJSON(JSON.parse(jsonString))
    graph.addCell(link)
    service.umlgraph = graph;
    buildTheJsonForUML();
    //
  };

  function genTable(data) {
    var table = "<table><tr><td></td>"
    var list = data.data.data;
    var i;
    var j;
    for (i = 0; i < list.length; i++) {
      for (j = 0; j < list[0].length; j++) {
        // the first row in the table
        if (i == 0) {
          table = table + "<th>" + list[i][j] + "</th>"
          if (j == list[0].length - 1) {
            table = table + "</tr>"
          }
        }
        else {
          if (j == 0) {
            table = table + "<tr><th>" + list[0][i - 1] + "</th>" + "<td>" + list[i][j] + "</td>"
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

  
  self.showMatrixWindowModal = function () {
    self.UpdateTheJSON()
    self.sendRequest();
    buildTheJsonForUML();
    var target = $document[0].getElementById('showMatrix');
    target.style.display = 'block';
  };

  function buildTheJsonForUML() {
    service.classList = [];
    graph.attributes.cells.models.forEach(element => {
      if (element.attributes.type == 'uml.Class' && element.attributes.isdefault == false) {
        var myclass = {
          "name": element.attributes.name,
          "attributes": element.attributes.attributes
        }
        service.classList.push(myclass);
      }
    })
  }

  self.closeMatrixWindowModal = function () {
    document.getElementById('showMatrix').style.display = 'none';
  };


}]);



