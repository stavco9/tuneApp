const {PyMachine} = require('./PyMachine/pymachine');

//let RecommendationsMachine_knn = new PyMachine(__dirname + '/../../MachineLearning/pythonScripts/Recommendations_KNN.py');
//let RecommendationsMachine_id3 = new PyMachine(__dirname + '/../../MachineLearning/pythonScripts/Recommendations_ID3.py');
//let RecommendationsMachine_nn = new PyMachine(__dirname + '/../../MachineLearning/pythonScripts/Recommendations_NN.py');
let similarTracksMachine_knn = new PyMachine(__dirname + '/../MachineLearning/pythonScripts/similarTracks_KNN.py');

// Function names are as follows:
// [Function goal and returned value type]_[Algorithm used]

// =====   in:   =====
// familliarTracks: [
//     {
//         trackId
//         AudioFeatures: {
//             ...
//         }
//         ...
//     }
// ]
// testedTracks: [
//     {
//         trackId
//         AudioFeatures: {
//             ...
//         }
//         ...
//     }
// ]
//
// =====   out:   =====
// [
//     {
//         trackId
//         ...
//     }
// ]
//
// recommendedTracks returned as track objects
// as they are presented as the testedTracks array
async function classifyForRecommendedTracks_knn(familliarTracks, testedTracks) {
    let familliarTracksFeatures = familliarTracks.map((t) => {
        return ReformatAudioFeatures(t);
    });
    let testedTracksFeatures = testedTracks.map((t) => {
        return ReformatAudioFeatures(t);
    });

    let recommendations = [];
    testedTracks.forEach(async (t, i) => {
        let isRecommended = await RecommendationsMachine_knn.run({
            'y': testedTracksFeatures[i],
		    'X': familliarTracksFeatures
        });
        if(isRecommended) {
            recommendations.push(t);
        }
    });

    return recommendations;
}

// =====   in:   =====
// familliarTracks: [
//     {
//         trackId
//         AudioFeatures: {
//             ...
//         }
//         ...
//     }
// ]
// testedTracks: [
//     {
//         trackId
//         AudioFeatures: {
//             ...
//         }
//         ...
//     }
// ]
//
// =====   out:   =====
// [
//     {
//         trackId
//         ...
//     }
// ]
//
// recommendedTracks returned as track objects
// as they are presented as the testedTracks array
async function classifyForRecommendedTracks_id3(familliarTracks, testedTracks) {
    let familliarTracksFeatures = familliarTracks.map((t) => {
        return ReformatAudioFeatures(t);
    });
    let testedTracksFeatures = testedTracks.map((t) => {
        return ReformatAudioFeatures(t);
    });

    let recommendations = [];
    testedTracks.forEach(async (t, i) => {
        let isRecommended = await RecommendationsMachine_id3.run({
            'y': testedTracksFeatures[i],
		    'X': familliarTracksFeatures
        });
        if(isRecommended) {
            recommendations.push(t);
        }
    });

    return recommendations;
}

// =====   in:   =====
// neuralNetwork: [
//     [], [], [], ...
// ]
// testedTracks: [
//     {
//         trackId
//         AudioFeatures: {
//             ...
//         }
//         ...
//     }
// ]
//
// =====   out:   =====
// [
//     {
//         trackId
//         ...
//     }
// ]
//
// recommendedTracks returned as the track objects
// as they are presented as the testedTracks array
async function classifyForRecommendedTracks_neuralnetwork(neuralNetwork, testedTracks) {
    neuralNetwork = ReformatNeuralNetwork(neuralNetwork);
    let testedTracksFeatures = testedTracks.map((t) => {
        return ReformatAudioFeatures(t);
    });

    let recommendations = [];
    testedTracks.forEach(async (t, i) => {
        let isRecommended = await RecommendationsMachine_nn.run({
            't': testedTracksFeatures[i],
		    'nn': neuralNetwork
        });
        if(isRecommended) {
            recommendations.push(t);
        }
    });

    return recommendations;
}

// =====   in:   =====
// neuralNetwork: [
//     [], [], [], ...
// ]
// familliarTracks: [
//     {
//         trackId
//         AudioFeatures: {
//             ...
//         }
//         ...
//     }
// ]
// testedTracks: [
//     {
//         trackId
//         AudioFeatures: {
//             ...
//         }
//         ...
//     }
// ]
//
// =====   out:   =====
// [
//     {
//         trackId
//         ...
//     }
// ]
//
async function classifyForRecommendedTracks_all(neuralNetwork, familliarTracks, testedTracks)
{
    let results = await Promise.all([
        classifyForRecommendedTracks_knn(familliarTracks, testedTracks),
        classifyForRecommendedTracks_id3(familliarTracks, testedTracks),
        classifyForRecommendedTracks_neuralnetwork(neuralNetwork, testedTracks)
    ]);

    results.forEach((arrOfRecommendedTracks) => {
        arrOfRecommendedTracks.forEach((r) => {
            let track = testedTracks.find((t) => t.trackId === r.trackId)
            if(track.recommendationsCounter === undefined) {
                track.recommendationsCounter = 0;
            }
            track.recommendationsCounter++;
        });
    });
    
    return testedTracks.filter((a) => a.recommendationsCounter !== undefined)
        .sort((a, b) => b.recommendationsCounter - a.recommendationsCounter);
}

// =====   in:   =====
// baseTrack: {
//     trackId
//     AudioFeatures: {
//         ...
//     }
//     ...
// }
// testedTracks: [
//     {
//         trackId
//         AudioFeatures: {
//             ...
//         }
//         ...
//     }
// ]
//
// =====   out:   =====
// [
//     {
//         trackId
//         ...
//     }
// ]
//
// similarTracks returned as track objects
// as they are presented as the testedTracks array
async function SearchForSimilarTracks_knn(baseTrack, testedTracks) {
    let baseTrackFeatures = ReformatAudioFeatures(baseTrack);
    let testedTracksFeatures = testedTracks.map((t) => {
        return ReformatAudioFeatures(t);
    });

    let similarIndexes = await similarTracksMachine_knn.run({
        'y': baseTrackFeatures,
        'X': testedTracksFeatures
    });
    return (similarIndexes.map((i) => {
        return testedTracks[i];
    }));
}

function ReformatAudioFeatures(track) {
    let featuresObject = track.AudioFeatures;
    let features = [];
    features.push(featuresObject.danceability);
    features.push(featuresObject.energy);
    features.push(featuresObject.key / 10);
    features.push(featuresObject.loudness);
    features.push(featuresObject.mode);
    features.push(featuresObject.speechiness);
    features.push(featuresObject.acousticness);
    features.push(featuresObject.instrumentalness);
    features.push(featuresObject.liveness);
    features.push(featuresObject.valence);
    features.push(featuresObject.tempo);
    features.push(featuresObject.time_signature);
    return features;
}

function ReformatNeuralNetwork(nn) {
    return nn;
}

module.exports = {
    Recommendations: {
        classifyMultipleByKNN: classifyForRecommendedTracks_knn,
        classifyMultipleByID3: classifyForRecommendedTracks_id3,
        classifyMultipleByNN: classifyForRecommendedTracks_neuralnetwork,
        classifyMultiple: classifyForRecommendedTracks_all
    },
    SimilarTracks: {
        search: SearchForSimilarTracks_knn
    }
};