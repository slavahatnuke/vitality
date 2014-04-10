var Class = require('define-class');

var Definition = Class({

    init: function(name, config){

        this.name = name;

        this.title = config.title ? config.title : name;

        this.if = config.if ? config.if : null;
        this.if_not = false;

        if(config['if.not'])
        {
            this.if = config['if.not'];
            this.if_not = true;
        }


        this.else = config.else ? config.else : null;

//        this.passed = false;
//        this.skipped = false;
//        this.failed = false;

        this.tested = false;
        this.built = false;

        this.tested_result = false;
        this.built_result = false;

        this.status = 'skip';

    }
});

module.exports = Definition;