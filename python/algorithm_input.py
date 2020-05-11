# this file contain functions that viewed the final matrix 


# this function is return the main matrix -->algorithm input :[ angular uml,SQL,nfr]
def get_algorithminput_data(umlData, sqlData, nfrData, weights):
    # there is no classes in the uml graph
    if (umlData["data"][0] == []):
        return {'data': [[]]}
    umlMatrix = umlData["data"][1:]
    uml_weight = weights[0]
    sqlMatrix = sqlData["data"][1:]
    sql_weight = weights[1]
    nfrMatrix = nfrData["data"][1:]
    nfr_weight = weights[2]
    # normalization the sql,nfr matrix ,check the max value
    umlMaxValue = 1
    sqlMaxValue = 1
    for i in range(0, len(umlMatrix)):
        for j in range(0, len(umlMatrix[i])):
            if (float(umlMatrix[i][j]) > float(umlMaxValue)):
                umlMaxValue = umlMatrix[i][j]
            if (float(sqlMatrix[i][j]) > float(sqlMaxValue)):
                sqlMaxValue = sqlMatrix[i][j]
    # update the matrix , div each cell with max value
    for i in range(0, len(umlMatrix)):
        for j in range(0, len(umlMatrix[i])):
            umlMatrix[i][j] = float(umlMatrix[i][j]) / float(umlMaxValue)
            sqlMatrix[i][j] = float(sqlMatrix[i][j]) / float(sqlMaxValue)
    # answer definition
    answer = [[0 for i in range(len(umlMatrix))] for j in range(len(umlMatrix))]
    for i in range(0, len(umlMatrix)):
        for j in range(0, len(umlMatrix[i])):
            umlValue = float(uml_weight) * float(umlMatrix[i][j]) / 100
            sqlValue = float(sql_weight) * float(sqlMatrix[i][j]) / 100
            nfrValue = float(nfr_weight) * float(nfrMatrix[i][j]) / 100
            answer[i][j] = umlValue + sqlValue + nfrValue
    answer.insert(0, umlData["data"][0])

    return {'data': answer}
