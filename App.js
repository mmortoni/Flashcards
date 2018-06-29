import React from 'react'
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux'
import { Font } from 'expo'

import { apiMiddleware } from './src/store/middleware/middleware-api'
import { getAllQuizData } from './src/store/actions/index'
import rootReducer from './src/store/reducers'

const quizData = require('./src/utils/quiz.json')
const cardDeckData = require('./src/utils/cardDeck.json')

const store = createStore(rootReducer, applyMiddleware(apiMiddleware))

import StoreDB from './src/utils/storeDB'
import QuizNavigator from './src/QuizNavigator/index'

const storeDB = new StoreDB({
  dbName: "flashcards"
})

window.DB = {
  'quiz': storeDB.model('quiz'),
  'cardDeck': storeDB.model('cardDeck'),
  'quizScore': storeDB.model('quizScore'),
  'notification': storeDB.model('notification'),
}

store.dispatch( getAllQuizData() )

export default class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      fontLoaded: true,
    }
  }

  async componentWillMount() {
    await Font.loadAsync({
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Ionicons': require('native-base/Fonts/Ionicons.ttf'),
    });

    this.setState({ fontLoaded: false })

    await DB.quiz.multiAdd(quizData)
    await DB.cardDeck.multiAdd(cardDeckData)
  }

  async componentWillUnmount() {
    console.log('Screen exit');
  }

  render() {
    if (this.state.loading) {
      return <Expo.AppLoading />;
    }

    return (
      <Provider store={store}>
        <QuizNavigator />
      </Provider>
    );
  }
}
