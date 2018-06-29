import { combineReducers } from 'redux'

import { quiz } from './reducers-quiz'
import { deck } from './reducers-deck'
import { ui } from './reducers-ui'

export default combineReducers({
    quiz,
    deck,
    ui
})
