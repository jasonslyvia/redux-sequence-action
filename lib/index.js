'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

exports['default'] = function (_ref) {
  var dispatch = _ref.dispatch;
  var getState = _ref.getState;
  return function (next) {
    return function (action) {
      var steps = action.steps;

      if (!steps || !Array.isArray(steps) || !steps.every(function (s) {
        return typeof s === 'function';
      })) {
        return next(action);
      }

      steps.reduce(function (result, currStep) {
        return result.then(function () {
          return Promise.resolve(currStep(dispatch, getState));
        });
      }, Promise.resolve());
    };
  };
};

module.exports = exports['default'];