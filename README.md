Redux Sequence Action
==========================

A [middleware](http://rackt.github.io/redux/docs/advanced/Middleware.html) enabling sequential action dispatch for Redux.

[![Build Status](https://travis-ci.org/jasonslyvia/redux-sequence-action.svg)](https://travis-ci.org/jasonslyvia/redux-sequence-action)
[![npm version](https://badge.fury.io/js/redux-sequence-action.svg)](http://badge.fury.io/js/redux-sequence-action)

```
$ npm install --save redux-sequence-action
```

## Why

Suppose you have a `AddressPicker` component which let user select the delivery address. It consists of 2 `select` with state list and city list. User can picks a state then a city.

![select](http://ww2.sinaimg.cn/bmiddle/831e9385gw1ex7w1vkbypj205900rjr7.jpg)

So you will have the following action creators:

 - selectState (stateId)
 - selectCity (cityId)

However, when user changes a state, the city list should be updated accordding to new state. For action creator `selectState`, it actually does the duty of `selectState` and `selectCity`.

For example, suppose we must dispatch some actions in certain order: A => B & C => D => E. A is a sync action and others are async actions. So we do this:

````javascript
dispatch((dispatch, getState) => {
    dispatch(A);
    Promise.all(dispatch(B), dispatch(C)).then(() => {
        return dispatch(D);
    }).then(() => {
        dispatch(E);
    });
})
// A => B & C => D => E
// A ~ E are actions
```

It need apply a thunk middleware which dispatch function like action, and a fetch middleware which is responsible for getting API data and return a promise.

```javascript
store => next => action => {
  //return a promise here
  return asyncAction(url, params).then(
    data => {
      return next({...action, payload: data, type: successType})
    }, e => {}
  )
}

```

If you use redux-sequnce-action, you can merely write declarative code like this:

```javascript
dispatch([
    A,
    [B, C],
    D,
    E
])
```

Yes, we only provide a syntax sugar.

## How

To better reuse our code, we can dispatch a action that dispatchs more action in sequence, looks like this:

```javascript
function selectState(stateId) {
  return [
    {
      type: 'SELECT_STATE',
      payload: stateId
    },
    (dispatch, getState) => {
      // `getState()` returns the state (or store) which is computed through
      // first action, so you can use this updated store to find out needed
      // portion and pass it to next action creator
      const {cityId} = getState().cityList[0];
      dispatch(selectCity(cityId))
    }
  ]
}

function selectCity(cityId) {
  return {
    type: 'SELECT_CITY',
    payload: cityId
  };
}
```

When we call `selectState(13)`, this action creator will first dispatch a `SELECT_STATE` action with payload `13`. Our reducer should update and return the new state (or store).

Then it will dispatch another action defined as the second element in `steps` array. Inside this function, we can get updated store and find out wanted part of the store and pass it to next action.

## Usage

```
$ npm install --save redux-sequence-action
```

Then, to enable Redux Sequence Action, use applyMiddleware():

```
import { createStore, applyMiddleware } from 'redux';
import sequenceAction from 'redux-sequence-action';
import rootReducer from './reducers/index';

// create a store that has redux-sequence-action middleware enabled
const createStoreWithMiddleware = applyMiddleware(
  sequenceAction
)(createStore);

const store = createStoreWithMiddleware(rootReducer);
```

As your action creator, it should return an array of actions.

## Scripts

```
$ npm run test
```

## License

MIT

