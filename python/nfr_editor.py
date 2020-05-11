# this file contain the nfr function

def get_nfr_data(js):
    print(js["defalutValue"])
    d=[]
    MaxValueNfrs=[]
    # weights = [0.46, 0.25, 0.12, 0.08, 0.05, 0.04]
    weights=[]
    for x in js["defalutValue"]:
        d.append(x)
        Nfr = js["defalutValue"][x]
        weights.append(Nfr["value"])
    allarays=[]
    allmatrix = []
    for nfr in d:
        print(nfr)
        arr=buildarray(js["tableInfo"], nfr)
        allarays.append(arr)
        Nfr = js["defalutValue"][nfr]
        max=getmaxnfr(Nfr)
        allmatrix.append(buildmatrix(arr, max))
    classarray=[]
    for c in js["tableInfo"]:
        classarray.append(c)
    lastmatrix = buildTheLastMatrix(allmatrix, weights, len(allarays[0]))
    print(lastmatrix)
    matrixwithclasses = []
    matrixwithclasses.append(classarray)
    for arr in lastmatrix:
        matrixwithclasses.append(arr)
    lastjs = {'data': matrixwithclasses}
    return lastjs

def getmaxnfr(Nfr):
    maxNfr=0
    if (Nfr["type"] == "Select Box"):
        for n in Nfr["legend"]:
            print(Nfr["legend"])
            if (Nfr["legend"][n] > maxNfr):
                maxNfr = Nfr["legend"][n]
    else:
        maxNfr=Nfr["max"]
    return maxNfr
def buildarray(js, nfr):
    arr = []
    for c in js:
        arr.append(float(js[c][nfr]))
    return arr


def buildmatrix(arr, maxnum):
    mat = []
    for r in arr:
        r = float(r)
        mat.append([1 - (abs(float(r) - elem)) / maxnum for elem in arr])
    return mat


def buildTheLastMatrix(allmatrix, weights, n):
    rows, cols = (n, n)
    lastmatrix = [[0 for i in range(cols)] for j in range(rows)]
    indexrow = 0
    indexcol = 0
    for r in lastmatrix:
        if (indexrow >= n):
            continue
        for c in r:
            if (indexcol >= n):
                continue
            value =float( 0)
            for nfrn in range(len(weights)):
                value=value+(float(weights[nfrn])*float(allmatrix[nfrn][indexrow][indexcol]))
            lastmatrix[indexrow][indexcol] = "{:.3f}".format(value)
            indexcol += 1
        indexrow += 1
        indexcol = 0
    return lastmatrix
