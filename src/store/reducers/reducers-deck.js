import { DECK_FIND, DECK_ADD } from '../action-types'

export const deck = (state = [], action) => {
    switch (action.type) {
        case DECK_FIND.SUCCESS:
            return [...action.payload]
        case DECK_FIND.PENDING:
            return []
        case DECK_FIND.FAILURE:
            return state
        case DECK_ADD.SUCCESS:
            return [...action.payload]
        case DECK_ADD.PENDING:
            return state
        case DECK_ADD.FAILURE:
            return state
        default:
            return state
    }
}
