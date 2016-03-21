function hitCounter(countSame) {
    var hits = new Map();
    var hitCount = 0;
    var middleware = (request, response, next) => {
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
    };
    middleware.clearHits = () => {
        hits.clear();
        hitCount = 0;
    };
    middleware.hitCount = () => hitCount;
    middleware.hits = () => hits.entries();
    return middleware;
}

module.exports = hitCounter;
