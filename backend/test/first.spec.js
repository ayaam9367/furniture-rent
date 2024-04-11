import assertion from "assert";
describe('Array', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assertion.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});

describe("my first test case", function(){
    it("value check", function(){
        assertion.equal([1, 2, 3].indexOf(3), 2);
    });
});