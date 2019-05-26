import { createStore, applyMiddleware } from "redux";

// Logger with default options
import logger from "redux-logger";
import { BookingReducer, defaultState} from "./reducers";
import thunk from 'redux-thunk';

export default function configureStore(initialState = defaultState) {
  const store = createStore(BookingReducer, initialState , applyMiddleware(logger, thunk));
  return store;
}