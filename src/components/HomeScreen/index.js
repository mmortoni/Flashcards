'use strict';

import React from 'react'
import { Animated, Easing } from "react-native";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Container,
  Header,
  Footer,
  FooterTab,
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

const ANIMATION_LOOP = 3;
const ANIMATION_DURATION = 1000;

export class HomeScreen extends React.Component {
  constructor(props) {
    super(props)

    this.animatedValue = new Animated.Value(0)
    this.state = {
      opacity: this.animatedValue.interpolate({ inputRange: [1, 1], outputRange: [1, 1] })
    };

    this.handleClick = this.handleClick.bind(this)
    this.animate = this.animate.bind(this);
  }

  async componentDidMount() {
    await this.props.getAllQuizData();
  }

  handleClick(quiz) {
    this.setState({ opacity: this.animatedValue.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 1, 0] }) });
    this.animate(ANIMATION_LOOP);

    setTimeout(() => {
      this.setState({ opacity: this.animatedValue.interpolate({ inputRange: [1, 1], outputRange: [1, 1] }) });
      this.props.navigation.navigate('Deck', {
        quiz: quiz,
      });
    }, ANIMATION_LOOP * ANIMATION_DURATION);
  }

  animate(loop) {
    if (loop > 0) {
      this.animatedValue.setValue(0)
      loop -= 1;
      Animated.timing(
        this.animatedValue,
        {
          toValue: 1,
          duration: ANIMATION_DURATION,
          easing: Easing.linear
        }
      ).start(() => this.animate(loop))
    }
  }

  render() {
    const { data, pending } = this.props

    if (pending) return <Text>Loading...</Text>

    const quiz = Object.entries(data).map(q => { return { id: q[1].id, title: q[1].title, cards: q[1].cardDeck.length } })

    return (
      <Container>
        <Header>
          <Body>
            <Title>Mobile Flashcards</Title>
          </Body>
        </Header>
        <Content>
          <List dataArray={quiz} renderRow={(q) =>
            <Animated.View style={{ opacity: this.state.opacity }}>
              <ListItem style={{ marginLeft: 0, paddingLeft: 15 }} button={true} onPress={() => { this.handleClick(q) }}>
                <Text>{q.title + ' - ' + q.cards} cards</Text>
              </ListItem>
            </Animated.View>
          }>
          </List>
        </Content>

        <Footer >
          <FooterTab>
            <Left>
              <Button onPress={() => this.props.navigation.navigate("Quiz")}>
                <Icon name="ios-add-circle" />
                <Text>New Quiz</Text>
              </Button>
            </Left>
          </FooterTab>
        </Footer>
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
