import sys
import json
import numpy as np
from sklearn.tree import DecisionTreeClassifier

while True:
    j = json.loads(sys.stdin.readline())
    X = np.array(j['X'])
    y = np.array(j['y'])
    T = np.array(j['T'])
    dt = DecisionTreeClassifier().fit(X, y)
    result = dt.predict(T).tolist()
    print(json.dumps(result))
    sys.stdout.flush()