# this file contain the sql function

def get_sql_data(request):
    # in th 1st position in the arr there is a classes names
    bigList = []
    setClassName = []
    for i in range(1, len(request)):
        if (request[i]["joinClass"] != None and request[i]["selected"]==True):
            print(request[i])
            setClassName.append(request[i]["joinClass"])
    allCobination = getAllPairs(setClassName)
    classNamesArr = request[0]
    tmpAnswer = getmatrix(classNamesArr, allCobination)
    bigList.append(classNamesArr)
    for i in tmpAnswer:
        bigList.append(i)
    jsonAnswer = {}
    jsonAnswer['data'] = bigList
    return jsonAnswer


# the input of the function is setClassName --> [["Class1","Class2","Class1"],["Class1","Class2"]]
# the output is list of tuples like [("Class1","Class2"),("Class1","Class1"),("Class2","Class1"),("Class1","Class2")] --> all combination
def getAllPairs(setClassName):
    answer = []
    for i in range(0, len(setClassName)):
        for j in range(0, len(setClassName[i])):
            for k in range(j + 1, len(setClassName[i])):
                answer.append((setClassName[i][j], setClassName[i][k]))
    return answer


# classArr=["class1","class2"]
def getmatrix(classArr, allCombination):
    answer = []
    for i in range(0, len(classArr)):
        nameArr = [0 for j in range(len(classArr))]
        name = classArr[i]
        for t in allCombination:
            if (t[0] == name):
                nameArr[classArr.index(t[1])] = nameArr[classArr.index(t[1])] + 1
            elif (t[1] == name):
                nameArr[classArr.index(t[0])] = nameArr[classArr.index(t[0])] + 1
        answer.append(nameArr)
    return answer
