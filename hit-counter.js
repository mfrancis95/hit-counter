var hits = {};
var hitCount = 0;

function middleware(request, response, next) {
    var ip = request.ip;
    if (!(ip in hits)) {
        hits[ip] = ip;
        hitCount++;
    }
    next();
}

module.exports = () => middleware;
module.exports.hitCount = () => hitCount;
