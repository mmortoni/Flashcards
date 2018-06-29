'use strict';

import React from 'react'
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

import * as Actions from '../../store/actions/index'; //Import your actions

//const Data = require('../../utils/quiz.json')

export class HomeScreen extends React.Component {
  constructor(props) {
    super(props)

    this.handleClick = this.handleClick.bind(this);
  }

  async componentDidMount() {
    await this.props.getAllQuizData();
  }

  handleClick(quiz) {
    this.props.navigation.navigate('Deck', {
      quiz: quiz,
    });
  }

  render() {
    const { data, pending } = this.props;

    if (pending) return <Text>Loading...</Text>;

    const quiz = Object.entries(data).map(q => { return { id: q[1].id, title: q[1].title, cards: q[1].cardDeck.length } });

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
          <List dataArray={quiz}
            renderRow={(q) =>
              <ListItem button={true} onPress={() => { this.handleClick(q) }}>
                <Text>{q.title + ' - ' + q.cards} cards</Text>
              </ListItem>
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
