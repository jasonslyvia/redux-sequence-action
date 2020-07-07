import { Dispatch } from "redux";

interface IMiddleware {
  dispatch: Dispatch<any>;
  getState?: any;
}

export const sequenceAction = ({ dispatch, getState }: IMiddleware) => (
  next: any
) => (action: any) => {
  if (!Array.isArray(action)) {
    return next(action);
  }

  return action.reduce((result, currAction) => {
    return result.then(() => {
      if (!currAction) {
        return Promise.resolve();
      }

      return Array.isArray(currAction)
        ? Promise.all(currAction.map((item) => dispatch(item)))
        : dispatch(currAction);
    });
  }, Promise.resolve());
};

