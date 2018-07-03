'use strict';

import React from 'react'
import { Animated, Easing } from "react-native";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Container,
  Header,
  Content,
  Body,
  Button,
  Icon,
  Text,
  Title,
  List,
  ListItem,
  Left,
} from 'native-base'

import * as Actions from '../../store/actions/index';

export class HomeScreen extends React.Component {
  constructor(props) {
    super(props)

    this.state = { clicked: true }
    this.animatedValue = new Animated.Value(0)

    this.handleClick = this.handleClick.bind(this)
    this.animate = this.animate.bind(this);
  }

  async componentDidMount() {
    await this.props.getAllQuizData();
  }

  handleClick(quiz) {
    this.animate()

    setTimeout(() => {
      this.resetAnimation();

      this.props.navigation.navigate('Deck', {
        quiz: quiz,
      });
    }, 3000);
  }

  animate() {
    this.animatedValue.setValue(0)
    Animated.timing(
      this.animatedValue,
      {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear
      }
    ).start(() => this.animate())
  }

  resetAnimation() {
    this.animatedValue.setValue(0)
    Animated.timing(
      this.animatedValue,
      {
        toValue: 0,
        duration: 0,
        easing: Easing.linear
      }
    ).start()
  }

  render() {
    const { data, pending } = this.props

    if (pending) return <Text>Loading...</Text>

    const quiz = Object.entries(data).map(q => { return { id: q[1].id, title: q[1].title, cards: q[1].cardDeck.length } })

    const opacity = this.animatedValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 1, 0]
    })

    const opacityX = this.animatedValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 1, 0]
    })

    return (
      <Container>
        <Header>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate("Quiz")}
            >
              <Icon name="menu" />
            </Button>
          </Left>
          <Body>
            <Title>Mobile Flashcards</Title>
          </Body>
        </Header>

        <Content>
          <List dataArray={quiz} renderRow={(q) =>
            <Animated.View style={{ opacity }}>
              <ListItem style={{ marginLeft: 0, paddingLeft: 15, backgroundColor: 'powderblue' }} button={true} onPress={() => { this.handleClick(q) }}>
                <Text>{q.title + ' - ' + q.cards} cards</Text>
              </ListItem>
            </Animated.View>
          }>
          </List>
        </Content>

      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    pending: state.ui.pending,
    data: state.quiz
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)
