import sys
import json
import numpy as np
import pickle
import zlib
import codecs
from sklearn.neural_network import MLPClassifier

while True:
    j = json.loads(sys.stdin.readline())
    nn = j['nn']
    result = {}
    if nn == '?':
        nnModel = MLPClassifier(hidden_layer_sizes=(7,5),shuffle=False,max_iter=1,learning_rate_init=0.01)
        nnModel.fit([[0,0,0,0,0,0,0,0,0,0,0,0]],[0])
    else:
        nnModel = pickle.loads(zlib.decompress(codecs.decode(nn.encode(), "base64")))
    if len(j) > 1:
        X = np.array(j['X'])
        y = j['y']
        if y == '?':
            result['p'] = int(nnModel.predict([X])[0])
        else:
            nnModel.fit([X],[y])
            result['nn'] = codecs.encode(zlib.compress(pickle.dumps(nnModel)), "base64").decode().replace('\n','')
    else:
        result['nn'] = codecs.encode(zlib.compress(pickle.dumps(nnModel)), "base64").decode().replace('\n','')
    print(json.dumps(result))
    sys.stdout.flush()

# Possible input combinations:
# nn:?                            ===>  returns a new model
# nn:?     , X:(data), y:(data)   ===>  fits new model, returns the model
# nn:(data), X:(data), y:?        ===>  predicts, returns the prediction
# nn:(data), X:(data), y:(data)   ===>  fits current model, returns the model
#
# Possible but unnecessary input combinations (try not to use them...):
# nn:(data)                       ===>  returns the current model
# nn:?     , X:(data), y:?        ===>  predicts for untrained model
#
# any other combination may cause an error.
#
#
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