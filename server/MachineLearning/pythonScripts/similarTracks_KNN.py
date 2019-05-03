import sys
import json
from sklearn.neighbors import NearestNeighbors
import numpy as np

while True:
    j = json.loads(sys.stdin.readline())
    X = np.array(j['X'])
    y = np.array(j['y'])
    nbrs = NearestNeighbors(n_neighbors=4, algorithm='ball_tree').fit(X)
    result = nbrs.kneighbors([y],return_distance=False)
    print((''.join(str(e) for e in result)).replace(' ',','))
    sys.stdout.flush()