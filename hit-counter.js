var hits = new Map();

function middleware(request, response, next) {
    hits.set(request.ip, new Date());
    next();
}

module.exports = () => middleware;
module.exports.clearHits = () => hits.clear();
module.exports.hitCount = () => hits.size;
module.exports.hits = callback => hits.forEach(callback);
