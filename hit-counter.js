var hits = {};
var hitCount = 0;

function clearHits() {
    hits = {};
    hitCount = 0;
}

function middleware(request, response, next) {
    var ip = request.ip;
    if (!(ip in hits)) {
        hits[ip] = ip;
        hitCount++;
    }
    next();
}

module.exports = () => middleware;
module.exports.clearHits = clearHits;
module.exports.hitCount = () => hitCount;
