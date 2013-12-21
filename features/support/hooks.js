
var hooks = function () {
    this.Before(function(callback) {
        callback();
    });
};

module.exports = hooks;