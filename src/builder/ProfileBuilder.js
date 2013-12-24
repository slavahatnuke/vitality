var Class = require('define-class');
var _ = require('underscore');

var Definition = require('../model/Definition');
var Profile = require('../model/Profile');

var ProfileBuilder = Class({

    build: function(data) {

        var profile = new Profile();

        _(data).each(function (config, name) {
            profile.add(new Definition(name, config));
        });

        return profile;
    }

});

module.exports = ProfileBuilder;