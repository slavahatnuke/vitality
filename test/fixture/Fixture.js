var Path = require('path');

module.exports = function (base) {
    var base = base ? base : __dirname;
    return function (path) {
        return Path.resolve(base, path);
    }
};
