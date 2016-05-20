var fs = require("fs");

function hitCounter(countSame) {
    var hits = new Map();
    var totalHits = 0, uniqueHits = 0;
    var middleware = (request, response, next) => {
        var ip = request.ip;
        var hit = hits.get(ip);
        if (!hit) {
            hit = {count: 1, last: new Date()};
            hits.set(ip, hit);
            totalHits++;
            uniqueHits++;
        }
        else if (countSame) {
            var now = new Date();
            if (now.getTime() - hit.last.getTime() > countSame) {
                hit.count++;
                hit.last = now;
                totalHits++;
            }
        }
        next();
    };
    middleware.clear = () => {
        hits.clear();
        totalHits = uniqueHits = 0;
    };
    middleware.hits = () => hits.entries();
    middleware.save = file => {
        return new Promise((resolve, reject) => {
            fs.writeFile(file, JSON.stringify(Array.from(hits.entries())), error => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve();
                }
            });
        });
    };
    middleware.totalHits = () => totalHits;
    middleware.uniqueHits = () => uniqueHits;
    return middleware;
}

module.exports = hitCounter;
