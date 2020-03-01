import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import {userReducer} from './reducers';

const reducer = combineReducers({
  user : userReducer
})

 export const makeStore = (initial = {}) => {
   return createStore(reducer, initial,composeWithDevTools(applyMiddleware(thunk)))}