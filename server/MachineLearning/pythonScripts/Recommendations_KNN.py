import sys
import json
import numpy as np
from sklearn.neighbors import KNeighborsClassifier

while True:
    j = json.loads(sys.stdin.readline())
    X = np.array(j['X'])
    y = np.array(j['y'])
    T = np.array(j['T'])
    nbrs = KNeighborsClassifier(n_neighbors=min(10,len(X)), weights='distance').fit(X, y)
    result = nbrs.predict(T).tolist()
    print(json.dumps(result))
    sys.stdout.flush()