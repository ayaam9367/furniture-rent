import {assert, expect, should} from 'chai';


describe("Aspect Check", function(){
    
    let username = 'code improve';
    it('check string', function() {
        assert.typeOf(username, 'string');
    })

    it('equal match', function() {
        assert.equal(username, 'code improve');
    })
})