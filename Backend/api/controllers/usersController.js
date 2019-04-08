

export function GetUserIdFromReq(req) {
    return req && req.session && req.session.token && req.session.token.email;
}

function GetLastActivitiesByUserId(numOfActivities=200) {
    return []; // DO DATABASE SHIT
}

export function GetPreferredTracksByUserId(userId) {
    let lastActivities = GetLastActivitiesByUserId();
    let scale = 0;
    let preferredTracks = lastActivities.map((act) => {
        scale += 0.01;
        return {
            trackId: act.trackId,
            score: act.score * scale
        }
    }).sort(function(a, b) {
        return b.score - a.score;
    });

    return preferredTracks;
}

export function GetUnfamilliarTracksByUserId(userId) {
    return []; // CHANGE THAT LATER
}