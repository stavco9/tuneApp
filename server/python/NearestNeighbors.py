
# coding: utf-8

# In[22]:

import sys
print("AAAAAAAAAAAAAAAAAAA")
from sklearn.neighbors import NearestNeighbors
import numpy as np
import json
X = np.array(json.loads(argv[0]))
y = np.array(json.loads(argv[1]))

nbrs = NearestNeighbors(n_neighbors=2, algorithm='ball_tree').fit(X)
result = nbrs.kneighbors([y],return_distance=False)

print(result)

sys.exit()