var Class = require('define-class');

var Definition = Class({

    init: function(name, config){

        this.name = name;

        this.title = config.title ? config.title : name;

        this.test = config.test ? config.test : null;
        this.build = config.build ? config.build : null;

        this.tested = false;
        this.built = false;

        this.tested_result = false;
        this.built_result = false;

        this.status = 'skip';

        this.test_output = {
            error: null,
            out: null
        }

        this.build_output = {
            error: null,
            out: null
        }
    }
});

module.exports = Definition;