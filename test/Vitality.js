var should = require('should');
var sinon = require('sinon');
var fixture = require('./fixture/Fixture')();

var Vitality = require('../src/Vitality');

describe('Vitality', function(){

    describe('constructed', function(){

        it('without arguments', function(){
            new Vitality();
        })

        it('with log function', function(){
            var log = function () {

            };

            new Vitality(log);
        })

    })

    describe('run', function(){

        it('if profile', function(){

            var spy = sinon.spy();
            var vitality  = new Vitality(spy);

            var file = fixture('Vitality/if.yml');

            vitality.run(file);

        })

    })

})