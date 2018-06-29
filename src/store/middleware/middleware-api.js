import { API } from '../action-types'
import { TYPE } from '../../constants/constants'

export const apiMiddleware = ({ dispatch }) => next => action => {
    if (action.type !== API) {
        return next(action)
    }

    const { payload } = action

    dispatch({ type: payload.PENDING })

    switch (payload.type) {
        case TYPE.QUIZ_FIND: {
            DB.quiz.find()
                .then(resp => {
                    dispatch({ type: payload.SUCCESS, payload: resp })
                })
                .catch(err => {
                    console.log(err);
                    dispatch({ type: payload.FAILURE })
                });

            break
        }
        case TYPE.QUIZ_UPDATE_BY_ID: {
            DB.quiz.updateById(payload.cardDeck, payload.quizId)
                .then(resp => {
                    dispatch({ type: payload.SUCCESS, payload: resp })
                })
                .catch(err => {
                    console.log(err);
                    dispatch({ type: payload.FAILURE })
                });

            break
        }
        case TYPE.DECK_FIND: {
            DB.cardDeck.find(payload.filter)
                .then(resp => {
                    dispatch({ type: payload.SUCCESS, payload: resp })
                })
                .catch(err => {
                    console.log(err);
                    dispatch({ type: payload.FAILURE })
                });

            break
        }
        case TYPE.DECK_ADD: {
            DB.cardDeck.add(payload.cardDeck)
                .then(resp => {
                    dispatch({ type: payload.SUCCESS, payload: resp })
                })
                .catch(err => {
                    console.log(err);
                    dispatch({ type: payload.FAILURE })
                });

            break
        }
        default:
            break
    }
}
