'use strict';

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
    Container,
    Header,
    Footer,
    FooterTab,
    Content,
    Card,
    CardItem,
    Body,
    Title,
    Button,
    Icon,
    Text,
    Right,
    Left,
    ActionSheet,
} from 'native-base';

import * as Actions from '../../store/actions/index';

const BUTTONS = ['Correct', 'Incorrect'];

class StartQuizScreen extends Component {
    constructor(props) {
        super(props);

        this.state = { index: 0, lastQuestionAnswered: false }
        this.question = Array(this.props.navigation.state.params.cardDeck.length).fill(0);

        this.handleClick = this.handleClick.bind(this);
    }

    async handleClick() {
        const { cardDeck } = this.props.navigation.state.params;

        if (this.state.index < cardDeck.length - 1) {
            this.setState({ index: this.state.index + 1 })
        }
    }

    async exitStartQuizScreen(quiz) {
        await this.props.getAllDeckData({ where: { parentId: quiz.id } });
        this.props.navigation.navigate('Deck', {
            quiz: quiz,
        });
    }

    render() {
        const { quiz, cardDeck } = this.props.navigation.state.params;
        const score = this.question.reduce(
            (sum, value) => sum += value == 0 ? 1 : 0,
            0) / (this.question.length / 100);

        return (
            <Container>
                <ActionSheet ref={(c) => { ActionSheet.actionsheetInstance = c; }} />
                <Header>
                    <Body>
                        <Title>{quiz.title + ' - ' + (this.state.index + 1) + '/' + cardDeck.length} cards</Title>
                    </Body>
                </Header>

                <Content padder>
                    <Card>
                        <CardItem>
                            <Body>
                                <Text disabled>{cardDeck[this.state.index].question}</Text>
                            </Body>
                        </CardItem>
                    </Card>
                    <Card>
                        <CardItem>
                            <Left>
                                <Button transparent
                                    onPress={() =>
                                        ActionSheet.show(
                                            {
                                                options: BUTTONS,
                                                title: cardDeck[this.state.index].answer
                                            },
                                            buttonIndex => {
                                                this.question[this.state.index] = buttonIndex;
                                                this.setState({ lastQuestionAnswered: this.state.index + 1 == cardDeck.length });
                                            }
                                        )
                                    }
                                >
                                    <Text>Show Answer</Text>
                                    <Icon name='ios-eye' />
                                </Button>
                            </Left>
                        </CardItem>
                    </Card>
                    <Card>
                        {this.state.lastQuestionAnswered &&
                            <CardItem>
                                <Body>
                                    <Text>Score</Text>
                                    <Icon active name="ios-stats" />

                                    <Text>Well done—you've worked very hard!</Text>
                                    <Text>Your score is: {score}%</Text>
                                </Body>
                            </CardItem>
                        }
                    </Card>
                </Content>

                <Footer >
                    <FooterTab>
                        {this.state.lastQuestionAnswered &&
                            <Button onPress={() => this.setState({ index: 0, correct: 0, lastQuestionAnswered: false })}>
                                <Text>Restart Quiz</Text>
                                <Icon active name="ios-rewind" />
                            </Button>
                        }
                        {this.state.lastQuestionAnswered &&
                            <Button onPress={() => { this.exitStartQuizScreen(quiz); }}>
                                <Text>Back to Deck</Text>
                                <Icon active name="ios-skip-backward" />
                            </Button>
                        }

                        <Right>
                            <Button onPress={() => { this.handleClick(); }}>
                                <Text>Next</Text>
                                <Icon name='ios-arrow-forward' />
                            </Button>
                        </Right>
                    </FooterTab>
                </Footer>
            </Container>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        pending: state.ui.pending,
        data: state.quiz,
        cardDeck: state.deck,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(StartQuizScreen)
