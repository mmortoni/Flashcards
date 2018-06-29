import { TYPE } from '../constants/constants'

const asyncActionType = (type) => ({
	PENDING: `${type}_PENDING`,
	SUCCESS: `${type}_SUCCESS`,
	FAILURE: `${type}_FAILURE`,
})

export const API = 'API'
export const QUIZ_FIND = asyncActionType( TYPE.QUIZ_FIND )
export const QUIZ_UPDATE_BY_ID = asyncActionType( TYPE.QUIZ_UPDATE_BY_ID )
export const DECK_FIND = asyncActionType( TYPE.DECK_FIND )
export const DECK_ADD = asyncActionType( TYPE.DECK_ADD )
