import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from '../reducers/index';

// Connect our store to the reducer
export default createStore(rootReducer, applyMiddleware(thunk));
