# this file contain global helper functions 
import json
import sql_editor as sql
import nfr_editor as nfr
import uml_editor as uml
import algorithm_input as algo_input
import global_vars as g_var
import algorithm as algo
import mongodb_functions as mongo_func

# this function is parse the json 
def convertData(requestData):
    requestData = requestData.decode('utf-8')
    requestData = json.loads(requestData)
    return requestData

# this functions is return the data from the http requesrt after compute the matrix
def parse_requset(requestData):
    umlRequestData = requestData[0]
    umlRequestData = uml.get_uml_data(umlRequestData)
    sqlRequestData = requestData[1]
    sqlRequestData = sql.get_sql_data(sqlRequestData)
    nfrRequestData = requestData[2]
    nfrRequestData = nfr.get_nfr_data(nfrRequestData)
    weights = requestData[3]
    return umlRequestData,sqlRequestData,nfrRequestData,weights