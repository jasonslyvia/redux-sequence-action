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
  it('should pass if no `steps` set', function(){
    var action = {
      type: 'ACTION',
      payload: 1
    };
    var spy = chai.spy(next);
    sequenceAction({})(spy)(action);

    expect(spy).to.have.been.called.with(action);
  });

  it('should pass if `steps` are not array', function(){
    var stepAction = {
      type: 'ACTION',
      steps: {
        a: 1
      }
    };
    var spy = chai.spy(next);
    sequenceAction({})(spy)(stepAction);

    expect(spy).to.have.been.called.with(stepAction);
  });

  it('should pass if any of `steps` array is not a function', function(){
    var stepAction = {
      type: 'ACTION',
      steps: [1, 2, function(){}]
    };
    var spy = chai.spy(next);
    sequenceAction({})(spy)(stepAction);

    expect(spy).to.have.been.called.with(stepAction);
  });

  it('should call functions defined in `steps`', function(){
    var mockStep1 = function(dispatch, getState) {
      expect(getState()).to.equal({a: 1});
    };

    var mockStep2 = function(dispatch, getState) {
      expect(getState()).to.equal({a: 1});
    };

    var stepAction = {
      steps: [ mockStep1, mockStep2 ]
    };

    var mockGetState = function() {
      return {
        a: 1
      };
    };

    var store = {dispatch: {}, getState: mockGetState};

    sequenceAction(store)(next)(stepAction);
  });

  it('should let second function get the latest state', function(){
    var mockStore = {
      a: 1
    };
    var mockDispatch = (action) => {
      mockStore.a = 2;
      return action;
    };

    var mockStep1 = function(dispatch, getState) {
      dispatch({
        type: 'SOME_TYPE'
      });
    };

    var mockStep2 = function() {
      expect(mockStore).to.equal({a: 2});
    };

    var stepAction = {
      steps: [ mockStep1, mockStep2 ]
    };

    sequenceAction({})(next)(stepAction);
  });
});
