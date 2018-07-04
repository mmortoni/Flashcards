import React from 'react'
import { createStackNavigator } from 'react-navigation'

import HomeScreen from '../components/HomeScreen/index'
import QuizScreen from '../components/QuizScreen/index'
import CardScreen from '../components/CardScreen/index'
import DeckScreen from '../components/DeckScreen/index'
import StartQuizScreen from '../components/StartQuizScreen/index'

const QuizNavigator = createStackNavigator({
  Home: HomeScreen,
  Quiz: QuizScreen,
  Card: CardScreen,
  Deck: DeckScreen,
  StartQuiz: StartQuizScreen,
},
  {
    initialRouteName: 'Home',
  }
);

export default QuizNavigator
