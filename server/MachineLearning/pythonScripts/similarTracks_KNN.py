import sys
import json
import numpy as np
from sklearn.neighbors import NearestNeighbors

while True:
    j = json.loads(sys.stdin.readline())
    X = np.array(j['X'])
    y = np.array(j['y'])
    nbrs = NearestNeighbors(n_neighbors=4, algorithm='ball_tree').fit(X)
    result = nbrs.kneighbors([y],return_distance=False)
    print((','.join((''.join(str(e) for e in result)).split())).replace('[,','['))
    sys.stdout.flush()

#//                              
#//     `7MMF'      `7MMF' .g8""8q. `7MM"""Mq.  
#//       MM          MM .dP'    `YM. MM   `MM. 
#//       MM          MM dM'      `MM MM   ,M9  
#//       MM          MM MM        MM MMmmdM9   
#//       MM      ,   MM MM.      ,MP MM  YM.   
#//       MM     ,M   MM `Mb.    ,dP' MM   `Mb. 
#//     .JMMmmmmMMM .JMML. `"bmmd"' .JMML. .JMM.
#//
#//                 lior21 @ Github
#//