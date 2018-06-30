'use strict';

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
    Container,
    Header,
    Body,
    Content,
    Button,
    Title,
    List,
    Text,
    ListItem,
    Grid,
    Col,
    Row,
} from 'native-base';

import * as Actions from '../../store/actions/index'; //Import your actions

class DeckScreen extends Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    async componentDidMount() {
        await this.props.getAllDeckData({ where: { parentId: this.props.navigation.state.params.quiz.id } });
    }
  
    async handleClick(navigation, quiz, cardDeck) {
        if(navigation == 'Home') {
            await this.props.getAllQuizData();
        }

        this.props.navigation.navigate(navigation, {
            quiz: quiz,
            cardDeck: cardDeck,
        });
    }

    render() {
        const { quiz } = this.props.navigation.state.params;
        const { cardDeck, pending } = this.props;

       // if (pending) return <Text>Loading...</Text>;

        const hasCardDeck = cardDeck !== null && cardDeck.length > 0;

        return (
            <Container>
                <Header>
                    <Body>
                        <Title>{quiz.title + ' - ' + (hasCardDeck ? cardDeck.length : 0)} cards</Title>
                    </Body>
                </Header>

                <Content>
                    {hasCardDeck &&
                        <List dataArray={cardDeck}
                            renderRow={(c) =>
                                <ListItem>
                                    <Text>{c.question}</Text>
                                </ListItem>
                            }>
                        </List>
                    }

                    <Grid>
                        <Col>
                            <Row>
                                <Button small full transparent onPress={() => { this.handleClick('Card', quiz, []); }}>
                                    <Text>New Question</Text>
                                </Button>
                            </Row>
                        </Col>
                        <Col>
                            <Row>
                                {hasCardDeck &&
                                    <Button small full transparent onPress={() => { this.handleClick('StartQuiz', quiz, cardDeck); }}>
                                        <Text>Start Quiz</Text>
                                    </Button>
                                }
                                {!hasCardDeck &&
                                    <Button small full disabled transparent onPress={() => { this.handleClick('StartQuiz', quiz, cardDeck); }}>
                                        <Text>Start Quiz</Text>
                                    </Button>
                                }
                            </Row>
                        </Col>
                        <Col>
                            <Row>
                                <Button small full transparent onPress={() => { this.handleClick('Home', quiz, []); }}>
                                    <Text>Home</Text>
                                </Button>
                            </Row>
                        </Col>
                    </Grid>
                </Content >
            </Container >
        );
    }
}

const mapStateToProps = (state) => {
    return {
      pending: state.ui.pending,
      data: state.quiz,
      cardDeck: state.deck
    }
  }
  
  function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(DeckScreen)
