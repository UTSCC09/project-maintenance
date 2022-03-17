import { createStore } from "redux";
import {produce} from 'immer'
import { UPDATE_USER_DATA } from './constants'

const initialData = {
  userData: {}
}

const reducer = (state = initialData, action) => produce(state, draft => {
  const { payload } = action;
  switch (action.type) {
    case UPDATE_USER_DATA:
      return Object.assign({}, draft, {
        userData: payload.userData
      });
    default:
      return initialData;
  }
});


export const store = createStore(reducer)