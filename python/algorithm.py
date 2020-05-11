# this file contain the functions were called , when the user want to see the result , and the clusters paritation
import numpy as np
import pandas as pd
from sklearn.cluster import DBSCAN
from sklearn.cluster import AgglomerativeClustering
import itertools
from pandas.io.json import json_normalize
import simplejson as json

def dbScanAlgotithm(mainMatrix):
    answer = ""
    sim = pd.DataFrame(mainMatrix["data"][1:], columns=mainMatrix["data"][0], index=mainMatrix["data"][0])
    print(sim)
    # with pd.option_context('display.max_rows', None, 'display.max_columns', None):
    dist = sim.apply(inverse)
    no_cluster_dict = {}
    no_entities = {}
    eps = np.arange(0.5, 0.55, .05)
    # Compute DBSCAN
    i = 1
    for e in eps:
        db = DBSCAN(min_samples=1, metric='precomputed').fit(dist)
        core_samples_mask = np.zeros_like(db.labels_, dtype=bool)
        core_samples_mask[db.core_sample_indices_] = True
        labels = db.labels_
        n_clusters_ = len(set(labels)) - (1 if -1 in labels else 0)
        n_noise_ = list(labels).count(-1)
        clustersRange = range(0, n_clusters_, 1)
        answer = answer + "\n" + "eps = " + str(e)
        answer = answer + "\n" + "DBSCAN results:"
        answer = answer + "\n" + "Estimated number of clusters:" + str(n_clusters_)
        for j in clustersRange:
            answer = answer + "\n" + 'Cluster ' + str(j+1) + ':' + str(list(dist.index[np.nonzero(labels == j)[0]]))
        i += 1
        # Number of clusters in labels, ignoring noise if present.
        entities = 0
        if n_clusters_ in no_cluster_dict.keys():
            no_cluster_dict[n_clusters_] += 1
        else:
            no_cluster_dict[n_clusters_] = 1
        for x in range(n_clusters_):
            entities += len(list(dist.index[np.nonzero(labels == x)[0]]))
        if entities in no_entities.keys():
            no_entities[entities] += 1
        else:
            no_entities[entities] = 1
        return answer
        break


def dbScanAlgotithmArray(mainMatrix):
    answer = []
    sim = pd.DataFrame(mainMatrix["data"][1:], columns=mainMatrix["data"][0], index=mainMatrix["data"][0])
    print(sim)  
    dist = sim.apply(inverse)
    eps = np.arange(0.5, 0.55, .05)
    i = 1
    for e in eps:
        db = DBSCAN(min_samples=1, metric='precomputed').fit(dist)
        core_samples_mask = np.zeros_like(db.labels_, dtype=bool)
        core_samples_mask[db.core_sample_indices_] = True
        labels = db.labels_
        n_clusters_ = len(set(labels)) - (1 if -1 in labels else 0)
        n_noise_ = list(labels).count(-1)
        clustersRange = range(0, n_clusters_, 1)
        for j in clustersRange:
            answer.append(list(dist.index[np.nonzero(labels == j)[0]]))
        return answer
        

def calculateResult(weights, nfrTable, clusters, profiles):
    if (len(weights) == 0 | len(nfrTable) == 0 | len(clusters) == 0 | len(profiles) == 0):
        return
    nfrs = getNfrs(nfrTable)
    maxDist = {}
    maxDist = calculateMaxDist(profiles, nfrs)
    result = []
    j = 1
    for cluster in clusters:
        dict = {}
        tmpDic = []
        for n in nfrs:
            avg = calculateClusterAvg(cluster, nfrTable, n)
            dict[n] = avg
        for db in profiles:
            tmpRes = {}
            tmpRes["nfrValues"]={}
            i = 0
            weight = 0
            name = db['dbName']
            for (k, v) in db.items():
                if (k == "dbName"):
                    tmpRes["dbName"] = str(v)
                else:
                    val = (abs(v - dict[k])) / maxDist[k]
                    tmpRes["nfrValues"][k] = "{:.3f}".format(val)
                    weight += val * weights[i]
                    i = i + 1
            tmpRes['result'] = "{:.3f}".format(weight)
            tmpDic.append( tmpRes)
        clusterInfo = {'clusterName': j, 'clusterInfo': tmpDic}
        j = j + 1
        result.append(clusterInfo)
    print(result)
    return result

def calculateClusterAvg(clusters, nfrTable, nfr):
    avg = 0
    nfrInfo = nfrTable['tableInfo']
    for cluster in clusters:
        i = 0
        tmpArr = []
        arr = {}
        j=0
        for (k,v) in nfrInfo.items():
            if (cluster == k):
                arr['className'] = k 
                for (nfrkey,nfrvalue) in v.items():
                    arr[nfrkey] = nfrvalue


        if (arr['className'] == cluster):
            avg = avg + float(arr[nfr])
    avg = avg / len(clusters)
    return avg


def getNfrs(nfrTable):
    arr = nfrTable['defalutValue']
    res = []
    for (k, v) in arr.items():
            res.append(k)
    return res


def calculateMaxDist(profiles, nfrs):
    res = {}
    for i in nfrs:
        res[i] = 0
    for profile in profiles:
        for nfr in nfrs:
            if (profile[nfr] > res[nfr]):
                res[nfr] = profile[nfr]
    return res

def inverse(x):
    return (1 - x)