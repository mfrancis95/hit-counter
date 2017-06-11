const fs = require("fs");

function hitCounter(countSame) {
    const hits = new Map();
    let totalHits = 0, uniqueHits = 0;
    const middleware = (request, response, next) => {
        let hit = hits.get(request.ip);
        if (!hit) {
            hit = {count: 1, last: new Date()};
            hits.set(request.ip, hit);
            totalHits++;
            uniqueHits++;
        }
        else if (countSame) {
            const now = new Date();
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
            const json = {
                hits: Array.from(hits).reduce((object, entry) => {
                    object[entry[0]] = entry[1];
                    return object;
                }, {}),
                totalHits: totalHits,
                uniqueHits: uniqueHits
            };
            fs.writeFile(file, JSON.stringify(json), error => {
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
