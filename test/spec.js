require('babel/register');
var sequenceAction = require('../lib/');
var chai = require('chai');
var spies = require('chai-spies');
chai.use(spies);
var expect = chai.expect;

// mimic next middleware
function next(action) {

}

describe('sequenceAction', function(){
  it('should pass if action is not an array', function(){
    var action = {
      type: 'ACTION',
      payload: 1
    };
    var spy = chai.spy(next);
    sequenceAction({})(spy)(action);

    expect(spy).to.have.been.called.with(action);
  });

  it('should let second action get the latest state', function(){
    var mockState = {
      a: 1
    };

    var mockDispatch = function(action) {
      //mock thunkMiddleware
      if(typeof action === 'function') {
        return action();
      }

      mockState.a = action.payload;

      return action;
    };

    var mockAction1 = { type: 'SOME_TYPE', payload: 2 };

    var mockAction2 = function() {
      expect(mockState).to.equal({a: 2});
    };

    var stepAction = [ mockAction1, mockAction2 ];

    sequenceAction({})(next)(stepAction);
  });
});
