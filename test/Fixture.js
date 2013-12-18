require('should');


describe('Fixture.js // fixture helper', function(){

    it('should be a factory', function(){
        var factory = require('./fixture/Fixture');
        factory.should.be.type('function');
        factory().should.be.type('function');
    })

    it('should return fixture path by default', function(){
        var fixture = require('./fixture/Fixture')();
        var fs = require('fs');
        fs.existsSync(fixture('Fixture.js')).should.be.ok;
        fs.existsSync(fixture('Fixture100.js')).should.be.false;
    })

    it('should return fixture with base path', function(){
        var fixture = require('./fixture/Fixture')('/tmp');
        fixture('Fixture.js').should.be.equal('/tmp/Fixture.js');
    })

})