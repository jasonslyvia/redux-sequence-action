export default ({dispatch, getState}) => next => action => {
  const {steps} = action;

  if(!steps || !Array.isArray(steps) || steps.any(s => typeof s !== 'function')) {
    return next(action);
  }

  steps.reduce((result, currStep) => {
    return result.then(() => Promise.resolve(currStep(dispatch, getState)));
  }, Promise.resolve());
}
