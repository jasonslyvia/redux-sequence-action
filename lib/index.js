"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (_ref) {
  var dispatch = _ref.dispatch;
  var getState = _ref.getState;
  return function (next) {
    return function (action) {
      if (!Array.isArray(action)) {
        return next(action);
      }

      return action.reduce(function (result, currAction) {
        return result.then(function () {
          return Array.isArray(currAction) ? Promise.all(currAction.map(function (item) {
            return dispatch(item);
          })) : dispatch(currAction);
        });
      }, Promise.resolve());
    };
  };
};

module.exports = exports["default"];