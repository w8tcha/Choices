import { combineReducers } from 'redux';
import items from './items';
import groups from './groups';
import choices from './choices';
import loading from './loading';
import { cloneObject } from '../lib/utils';
import { State } from '../interfaces';
import { ACTION_TYPES } from '../constants';

export const defaultState: State = {
  groups: [],
  items: [],
  choices: [],
  loading: 0,
};

const appReducer = combineReducers({
  items,
  groups,
  choices,
  loading,
});

const rootReducer = (passedState, action): object => {
  let state = passedState;
  // If we are clearing all items, groups and options we reassign
  // state and then pass that state to our proper reducer. This isn't
  // mutating our actual state
  // See: http://stackoverflow.com/a/35641992
  if (action.type === ACTION_TYPES.CLEAR_ALL) {
    // preserve the loading state as to allow withDeferRendering to work
    const isLoading = state.loading;
    state = cloneObject(defaultState);
    state.loading = isLoading;
  } else if (action.type === ACTION_TYPES.RESET_TO) {
    return cloneObject(action.state);
  }

  return appReducer(state, action);
};

export default rootReducer;
