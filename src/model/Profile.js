var async = require('async');
var Class = require('define-class');

var Profile = Class({

    init: function(){
        this.definitions = [];
    },
    add: function (definition) {
        this.definitions.push(definition);
    },
    each: function (iterator, next) {
        async.eachSeries(this.definitions, iterator, next);
    }

});

module.exports = Profile;