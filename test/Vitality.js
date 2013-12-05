require('should');

var Vitality = require('../src/Vitality');

describe('Vitality', function(){
    describe('should be constructed', function(){

        it('without arguments', function(){
            var vitality = new Vitality();
            vitality.should.be.instanceOf(Vitality);
        })
    })
})