import sys
sys.path.append("python//")
from flask import Flask, jsonify, render_template
import json
from flask_cors import CORS, cross_origin
from flask import request
import simplejson as json
from flask_pymongo import PyMongo
##########################################
import sql_editor as sql
import nfr_editor as nfr
import uml_editor as uml
import algorithm_input as algo_input
import global_vars as g_var
import algorithm as algo
import helper_functions as h_func
import mongodb_functions as mongo_func

app = Flask(__name__, static_url_path='')
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config["MONGO_URI"] = "mongodb://localhost:27017/dbSelection"
mongo = PyMongo(app)

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route("/getUML", methods=['GET', 'POST'])
def umlHandler():
    answer = ""
    try:
        requestData=h_func.convertData(request.data)
        answer = uml.get_uml_data(requestData)
    except:
        print("uml server error")
    return jsonify(answer)

@app.route("/getSQL", methods=['GET', 'POST'])
def sqlhandler():
    answer = ""
    try:
        requestData=h_func.convertData(request.data)
        answer = sql.get_sql_data(requestData)
    except:
        print("sql server error")
    return jsonify(answer)

@app.route("/getNFR", methods=['GET', 'POST'])
def nfrHandler():
    answer = ""
    try:
        requestData=h_func.convertData(request.data)
        answer = nfr.get_nfr_data(requestData)
    except:
        print("nfr server error")
    return jsonify(answer)

@app.route("/getAlgorithmInput", methods=['GET', 'POST'])
def algorithmInput():
    answer=""
    try:
        requestData=h_func.convertData(request.data)
        umlRequestData,sqlRequestData,nfrRequestData,weights=h_func.parse_requset(requestData)
        answer = algo_input.get_algorithminput_data(umlRequestData, sqlRequestData, nfrRequestData, weights)
    except:
        print("algorithm server error")
    return jsonify(answer)

@app.route("/getClusters", methods=['GET', 'POST'])
def getClusters():
    answer=""
    try:
        requestData=h_func.convertData(request.data)
        umlRequestData,sqlRequestData,nfrRequestData,weights=h_func.parse_requset(requestData)
        mainMatrix = algo_input.get_algorithminput_data(umlRequestData, sqlRequestData, nfrRequestData, weights)
        answer = algo.dbScanAlgotithm(mainMatrix)
    except:
        print("clusters server error")
    return jsonify(answer)

@app.route("/getResult", methods=['GET', 'POST'])
def getResult():
    answer=""
    # try:
    requestData=h_func.convertData(request.data)
    print(requestData)
    umlRequestData,sqlRequestData,nfrRequestData,weights=h_func.parse_requset(requestData)
    mainMatrix = algo_input.get_algorithminput_data(umlRequestData, sqlRequestData, nfrRequestData, weights)
    clusters = algo.dbScanAlgotithmArray(mainMatrix)
    nfrRequestData = requestData[2]
    weights = g_var.weights
    profiles =mongo_func.getLocalDBProfiles()
    answer = algo.calculateResult(weights, nfrRequestData, clusters, profiles)
    # except:
    print("get result error")
    return jsonify(answer)

@app.route('/registerUser', methods=['GET', 'POST'])
def registerUser():
    answer = ""
    try:
        requestData=h_func.convertData(request.data)
        answer=mongo_func.registerUser(requestData)
    except:
        print("register user error")
    return jsonify(answer)

@app.route('/login', methods=['GET', 'POST'])
def login():
    answer=""
    try:
        requestData=h_func.convertData(request.data)
        answer=mongo_func.login(requestData)
    except:
        print("Login error")
    return jsonify(answer)

@app.route('/getUsersInfo', methods=['GET', 'POST'])
def getUsersInfo():
    answer=""
    try:
        requestData=h_func.convertData(request.data)
        answer=mongo_func.getUsersInfo(requestData)
    except:
        print("get users info error")
    return jsonify(answer)

@app.route('/deleteUser', methods=['GET', 'POST'])
def deleteUser():
    answer=""
    try:
        requestData=h_func.convertData(request.data)
        answer=mongo_func.deleteUser(requestData)
    except:
        print("delete user error")
    return jsonify(answer)

@app.route('/getQuestion', methods=['GET', 'POST'])
def getQuestion():
    answer=""
    try:
        requestData=h_func.convertData(request.data)
        answer=mongo_func.getQuestion(requestData)
    except:
        print("get question error")
    return jsonify(answer)

@app.route('/addQuestion', methods=['GET', 'POST'])
def addQuestion():
    answer=""
    try:
        requestData=h_func.convertData(request.data)
        answer=mongo_func.addQuestion(requestData)
    except:
        print("get question error")
    return jsonify(answer)

@app.route('/deleteQuestion', methods=['GET', 'POST'])
def deleteQuestion():
    answer=""
    try:
        requestData=h_func.convertData(request.data)
        answer=mongo_func.deleteQuestion(requestData)
    except:
        print("get question error")
    return jsonify(answer)
  
@app.route('/getDBProfiles', methods=['GET', 'POST'])
def getDBProfiles():
    answer=""
    try:
        requestData=h_func.convertData(request.data)
        answer=mongo_func.getDBProfiles(requestData)
    except:
        print("get DB Profiles error")
    return jsonify(answer)

@app.route('/deleteDBProfile', methods=['GET', 'POST'])
def deleteDBProfile():
    answer=""
    try:
        requestData=h_func.convertData(request.data)
        answer=mongo_func.deleteDBProfile(requestData)
    except:
        print("delete DB Profiles error")
    return jsonify(answer)

@app.route('/addDBProfile', methods=['GET', 'POST'])
def addDBProfile():
    answer=""
    try:
        requestData=h_func.convertData(request.data)
        answer=mongo_func.addDBProfile(requestData)
    except:
        print("add DB Profiles error")
    return jsonify(answer)

@app.route('/getNFRDefaultValue', methods=['GET', 'POST'])
def getNFRDefaultValue():
    answer=""
    try:
        answer=mongo_func.getNFRDefaultValue()
    except:
        print("get nfr default value error")
    return jsonify(answer)

@app.route('/getComponentDefaultValues', methods=['GET', 'POST'])
def getComponentDefaultValues():
    answer=""
    try:
        answer=mongo_func.getComponentDefaultValues()
    except:
        print("get component default value error")
    return jsonify(answer)

@app.route('/updateDefaultNFR', methods=['GET', 'POST'])
def updateDefaultNFR():
    answer=""
    try:
        requestData=h_func.convertData(request.data)
        answer=mongo_func.updateDefaultNFR(requestData)
    except:
        print("update default nfr values error")
    return jsonify(answer)

@app.route('/updateDefaultComponent', methods=['GET', 'POST'])
def updateDefaultComponent():
    answer=""
    try:
        requestData=h_func.convertData(request.data)
        answer=mongo_func.updateDefaultComponent(requestData)
    except:
        print("update default component error")
    return jsonify(answer)


@app.route('/updateDescription', methods=['GET', 'POST'])
def updateDescription():
    answer=""
    try:
        requestData=h_func.convertData(request.data)
        answer=mongo_func.updateDescription(requestData)
    except:
        print("update description error")
    return jsonify(answer)

@app.route('/AddNewProject', methods=['GET', 'POST'])
def AddNewProject():
    answer=""
    try:
        requestData=h_func.convertData(request.data)
        requestData["ProjectId"]=mongo_func.getNewProjectId()
        answer=mongo_func.AddNewProject(requestData)
    except:
        print("Adding New Project error")
    return jsonify(answer)

@app.route('/getprojects', methods=['GET', 'POST'])
def getProjects():
    answer=[]
    try:
        requestData=h_func.convertData(request.data)
        answer=mongo_func.getProjects(requestData)
    except:
        mongo_func.deleteNotRelevantProject()
        return getProjects()
        print("get Projects error")
    return jsonify(answer)

@app.route('/getProjectjson', methods=['GET', 'POST'])
def getProjectJson():
    answer={}
    try:
        requestData=h_func.convertData(request.data)
        answer=mongo_func.getProjectjson(requestData)
    except:
        print("get Project json error")
    return jsonify(answer)

@app.route('/UpdateProjectJson', methods=['GET', 'POST'])
def UpdateProjectJson():
    answer=""
    try:
        requestData=h_func.convertData(request.data)
        answer=mongo_func.UpdateProjectJson(requestData)
    except:
        print("get Project json error")
    return jsonify(answer)

@app.route('/ShareProject', methods=['GET', 'POST'])
def ShareProject():  
    answer=""
    try:
        requestData=h_func.convertData(request.data)
        print(requestData)
        answer=mongo_func.ShareProject(requestData)
    except:
        print("shre project error error")
    return jsonify(answer)

@app.route('/DeleteParticipant', methods=['GET', 'POST'])
def DeleteParticipant():
    answer=""
    try:
        requestData=h_func.convertData(request.data)
        answer=mongo_func.DeleteParticipant(requestData)
        print(answer)
    except:
        print("delete project error")
    return jsonify(answer)

@app.route('/DeleteProject', methods=['GET', 'POST'])
def DeleteProject():
    answer=""
    try:
        requestData=h_func.convertData(request.data)
        answer=mongo_func.DeleteProject(requestData)
        print(answer)
    except:
        print("delete project error")
    return jsonify(answer)

@app.route('/getAllprojects', methods=['GET', 'POST'])
def getAllprojects():
    answer=[]
    try:
        requestData=h_func.convertData(request.data)
        answer=mongo_func.getAllprojects(requestData)
    except:
        mongo_func.deleteNotRelevantProject()
        print("get all Projects error")
        return getProjects()
    return jsonify(answer)


@app.route('/restPassword', methods=['GET', 'POST'])
def restPassword():
    answer=[]
    try:
        requestData=h_func.convertData(request.data)
        answer=mongo_func.restPassword(requestData)
    except:
        print("rest password error")
    return jsonify(answer)


if __name__ == '__main__':
    app.run(port=5016, debug=True)
