'use strict';

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    StyleSheet,
    Animated
} from 'react-native';

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
    Segment,
} from 'native-base';

import { setLocalNotification, clearLocalNotification } from '../../utils/notifications'

import * as Actions from '../../store/actions/index';

const BUTTONS = ['Correct', 'Incorrect'];

class StartQuizScreen extends Component {
    constructor(props) {
        super(props);

        this.state = { index: 0, 
            restart: false, 
            lastQuestionAnswered: false,
            card: 0,
         }
        this.question = Array(this.props.navigation.state.params.cardDeck.length).fill(0);

        this.handleClick = this.handleClick.bind(this);
    }

    componentWillMount() {
        this.animatedValue = new Animated.Value(0);
        this.value = 0;
        this.animatedValue.addListener(({ value }) => {
            this.value = value;
        })
        this.frontInterpolate = this.animatedValue.interpolate({
            inputRange: [0, 180],
            outputRange: ['0deg', '180deg'],
        })
        this.backInterpolate = this.animatedValue.interpolate({
            inputRange: [0, 180],
            outputRange: ['180deg', '360deg']
        })
        this.frontOpacity = this.animatedValue.interpolate({
            inputRange: [89, 90],
            outputRange: [1, 0]
        })
        this.backOpacity = this.animatedValue.interpolate({
            inputRange: [89, 90],
            outputRange: [0, 1]
        })
    }

    flipCard() {
        if (this.value >= 90) {
            this.setState({ card: 0 })
            Animated.spring(this.animatedValue, {
                toValue: 0,
                friction: 8,
                tension: 10
            }).start();
        } else {
            this.setState({ card: 1 })
            Animated.spring(this.animatedValue, {
                toValue: 180,
                friction: 8,
                tension: 10
            }).start();
        }
    }

    async handleClick() {
        const { cardDeck } = this.props.navigation.state.params;

        if (this.state.index < cardDeck.length - 1) {
            this.setState({ index: this.state.index + 1 })
        }
    }

    async exitStartQuizScreen(quiz) {
        await this.props.getAllDeckData({ where: { parentId: quiz.id } });

        await this.saveOrUpdate(quiz);

        // Notification reschedule
        await clearLocalNotification();
        await setLocalNotification();

        this.props.navigation.navigate('Deck', {
            quiz: quiz,
        });
    }

    async saveOrUpdate(quiz) {
        const dateISOString = new Date().toISOString().slice(0, 10).replace(/-/g, "");

        const result = await DB.quizScore.find({ where: { parentId: quiz.id } });

        if (result.length > 0) {
            await DB.quizScore.updateById({
                quizDoneOnDate: dateISOString,
                totalQuizQuestions: this.question.length,
                correctScore: this.question.reduce((sum, value) => value == 0 ? sum += 1 : sum += 0, 0),
                incorrectScore: this.question.reduce((sum, value) => value == 1 ? sum += 1 : sum += 0, 0),
                userResetQuiz: this.state.restart
            }, result.id);
        } else {
            await DB.quizScore.add({
                id: '',
                parentId: quiz.id,
                quizDoneOnDate: dateISOString,
                totalQuizQuestions: this.question.length,
                correctScore: this.question.reduce((sum, value) => value == 0 ? sum += 1 : sum += 0, 0),
                incorrectScore: this.question.reduce((sum, value) => value == 1 ? sum += 1 : sum += 0, 0),
                userResetQuiz: this.state.restart
            });
        }
    }

    render() {
        const { quiz, cardDeck } = this.props.navigation.state.params;
        const frontAnimatedStyle = {
            transform: [
                { rotateY: this.frontInterpolate }
            ]
        }
        const backAnimatedStyle = {
            transform: [
                { rotateY: this.backInterpolate }
            ]
        }
        const showQuestionAnswer = this.state.card === 0 ? 'ANSWER': 'QUESTION';
        const score = this.question.reduce(
            (sum, value) => sum += value == 0 ? 1 : 0,
            0) / (this.question.length / 100);

        return (
            <Container>
                <ActionSheet ref={(c) => { ActionSheet.actionsheetInstance = c; }} />
                <Header hasSegment>
                    <Body>
                        <Title>{quiz.title + ' - ' + (this.state.index + 1) + '/' + cardDeck.length} cards</Title>
                    </Body>
                </Header>

                <Content padder>
                    <Card>
                        <CardItem header>
                            <Text disabled style={styles.flipText}>QUIZ</Text>
                        </CardItem>

                        <CardItem>
                            <Body>
                                <Animated.View style={[styles.flipCard, frontAnimatedStyle, { opacity: this.frontOpacity }]}>
                                    <Text disabled style={styles.flipText}>{cardDeck[this.state.index].question}</Text>
                                </Animated.View>

                                <Animated.View style={[styles.flipCard, styles.flipCardBack, backAnimatedStyle, { opacity: this.backOpacity }]}>
                                    <Text disabled style={styles.flipText}>{cardDeck[this.state.index].answer}</Text>
                                    <Segment>
                                        <Button first active><Text>{BUTTONS[0]}</Text></Button>
                                        <Button last><Text>{BUTTONS[1]}</Text></Button>
                                    </Segment>
                                </Animated.View>
                            </Body>
                        </CardItem>

                        <CardItem footer>
                            <Left>
                                <Button transparent onPress={() => this.flipCard()}>
                                    <Text>Show {showQuestionAnswer}</Text>
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
                                    <Text>Your score is: {score.toFixed(2)}%</Text>
                                </Body>
                            </CardItem>
                        }
                    </Card>
                </Content>

                <Footer >
                    <FooterTab>
                        {this.state.lastQuestionAnswered &&
                            <Button onPress={() => this.setState({ index: 0, restart: true, lastQuestionAnswered: false })}>
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
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(StartQuizScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    flipCard: {
        width: 360,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'blue',
        backfaceVisibility: 'hidden',
    },
    flipCardBack: {
        backgroundColor: "red",
        position: "absolute",
        top: 0,
    },
    flipText: {
        width: 360,
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
    }
});
