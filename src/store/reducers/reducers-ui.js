import { QUIZ_FIND, DECK_FIND } from '../action-types'

export const ui = (state = { pending: false }, action) => {
    switch (action.type) {
        case QUIZ_FIND.PENDING:
        case DECK_FIND.PENDING:
            return { ...state, pending: true }
        case QUIZ_FIND.SUCCESS:
        case DECK_FIND.SUCCESS:
            return { ...state, pending: false }
        default:
            return state
    }
}
