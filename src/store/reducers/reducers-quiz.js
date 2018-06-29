import { QUIZ_FIND,  QUIZ_UPDATE_BY_ID } from '../action-types'

export const quiz = (state = [], action) => {
    switch (action.type) {
        case QUIZ_FIND.SUCCESS:
            return [...action.payload]
        case QUIZ_FIND.PENDING:
            return state
        case QUIZ_FIND.FAILURE:
            return state
        case QUIZ_UPDATE_BY_ID.SUCCESS:
            return [...action.payload]
        case QUIZ_UPDATE_BY_ID.PENDING:
            return state
        case QUIZ_UPDATE_BY_ID.FAILURE:
            return state
        default:
            return state
    }
}
