import { TYPE } from '../../constants/constants'
import { API, QUIZ_FIND, DECK_FIND, QUIZ_UPDATE_BY_ID, DECK_ADD } from '../action-types'

export const getAllQuizData = () => ({
	type: API,
	payload: { type: TYPE.QUIZ_FIND, ...QUIZ_FIND }
})

export const quizUpdateById = (cardDeck, quizId) => ({
	type: API,
	payload: { type: TYPE.QUIZ_UPDATE_BY_ID, cardDeck: cardDeck, quizId: quizId, ...QUIZ_UPDATE_BY_ID }
})

export const getAllDeckData = (filter) => ({
	type: API,
	payload: { type: TYPE.DECK_FIND, filter: filter, ...DECK_FIND }
})

export const cardDeckAdd = (cardDeck) => ({
	type: API,
	payload: { type: TYPE.DECK_ADD, cardDeck: cardDeck, ...DECK_ADD }
})
