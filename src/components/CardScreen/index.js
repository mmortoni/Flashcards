'use strict';

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
    Container,
    Header,
    Footer,
    FooterTab,
    Body,
    Content,
    Button,
    Icon,
    Text,
    Title,
    Label,
    Form,
    Item,
    Input,
    Left,
    Right,
} from 'native-base';

import * as Actions from '../../store/actions/index';

class CardScreen extends Component {
    constructor(props) {
        super(props);

        const card = this.props.navigation.state.params.card;

        this.state = {
            question: card ? card.question : '',
            answer: card ? card.answer : '',
        }

        this.editCard = this.editCard.bind(this);
    }

    async componentWillUnmount() {
        await this.props.getAllDeckData({ where: { parentId: this.props.navigation.state.params.quiz.id } });
    }

    async editCard(quizId) {
        const card = this.props.navigation.state.params.card;
        const { question, answer } = this.state;
        let cardDeck;
        if (question.trim().length == 0 || answer.trim().length == 0) return;

        if (card) {
            cardDeck = await DB.cardDeck.updateById({ question: question, answer: answer }, card.id);
        } else {
            cardDeck = await DB.cardDeck.add({ id: '', question: question, answer: answer, parentId: quizId });
        }

        if (cardDeck) {
            if (card) {
                alert('Card successfully updated!');
            } else {
                await DB.quiz.updateById({ cardDeck: cardDeck.id }, quizId);

                this.setState({
                    question: '',
                    answer: '',
                })

                alert('Card successfully created!');
            }
        } else {
            alert('Error creating card!');
        }
    }

    async exitCardScreen(quiz) {
        this.props.navigation.navigate('Deck', {
            quiz: quiz,
        });
    }

    render() {
        const { question, answer } = this.state;
        const { quiz, card } = this.props.navigation.state.params;

        return (
            <Container>
                <Header>
                    <Body>
                        <Title>{quiz.title} - Cards</Title>
                    </Body>
                </Header>
                <Content padder>
                    <Form>
                        <Item>
                            <Label>Question:</Label>
                            <Input onChangeText={(question) => this.setState({ question: question })} value={this.state.question} />
                        </Item>
                        <Item>
                            <Label>Answer:</Label>
                            <Input onChangeText={(answer) => this.setState({ answer: answer })} value={this.state.answer} />
                        </Item>
                    </Form>
                </Content>

                <Footer >
                    <FooterTab>
                        <Left>
                            <Button onPress={() => this.editCard(quiz.id)}>
                                <Icon name="ios-create" />
                                <Text>{card ? 'Edit' : 'Create'}</Text>
                            </Button>
                        </Left>
                        <Right>
                            <Button onPress={() => this.exitCardScreen(quiz)}>
                                <Icon name="ios-exit" />
                                <Text>Exit</Text>
                            </Button>
                        </Right>
                    </FooterTab>
                </Footer>
            </Container>
        )
    }
};

const mapStateToProps = (state) => {
    return {
        deck: state.deck,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CardScreen)
