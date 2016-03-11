var hits = new Map();

var hitCount = 0, countSame;

function clearHits() {
    hits.clear();
    hitCount = 0;
}

function middleware(request, response, next) {
    var ip = request.ip;
    var hit = hits.get(ip);
    if (!hit) {
        hit = {count: 1, last: new Date()};
        hits.set(ip, hit);
        hitCount++;
    }
    else if (countSame) {
        var now = new Date();
        if (now.getTime() - hit.last.getTime() > countSame) {
            hit.count++;
            hit.last = now;
            hitCount++;
        }
    }
    next();
}

module.exports = countSameDelay => {
    countSame = countSameDelay;
    return middleware;
};
module.exports.clearHits = clearHits;
module.exports.hitCount = () => hitCount;
module.exports.hits = () => hits.entries();
