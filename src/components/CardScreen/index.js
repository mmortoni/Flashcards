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
    Text,
    Title,
    Label,
    Form,
    Item,
    Input,
    Left,
    Right,
    Grid,
    Col,
    Row,
} from 'native-base';

import * as Actions from '../../store/actions/index'; //Import your actions

class CardScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            question: '',
            answer: '',
        }

        this.createCard = this.createCard.bind(this);
    }

    async createCard(quizId) {
        const { question, answer } = this.state;
        if (question.trim().length == 0 || answer.trim().length == 0) return;

        const cardDeck = await DB.cardDeck.add({ id: '', question: question, answer: answer, parentId: quizId });

        if (cardDeck) {
            await DB.quiz.updateById({ cardDeck: cardDeck.id }, quizId);
            alert('Card successfully created!');
        } else {
            alert('Error creating card!');
        }
    }

    async exitCardScreen(quiz) {
        await this.props.getAllDeckData({ where: { parentId: quiz.id } });
        this.props.navigation.navigate('Deck', {
            quiz: quiz,
        });
    }

    render() {
        const { question, answer } = this.state;
        const { quiz } = this.props.navigation.state.params;

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
                            <Input onChangeText={question => this.setState({ question: question })} />
                        </Item>
                        <Item>
                            <Label>Answer:</Label>
                            <Input onChangeText={answer => this.setState({ answer: answer })} />
                        </Item>
                    </Form>

                    <Grid>
                        <Col>
                            <Row>
                                <Button small full transparent onPress={() => { this.createCard(quiz.id); }}>
                                    <Text>Create</Text>
                                </Button>
                            </Row>
                        </Col>
                        <Col>
                            <Row>
                                <Button small full transparent onPress={() => { this.exitCardScreen(quiz); }}>
                                    <Text>Exit</Text>
                                </Button>
                            </Row>
                        </Col>
                    </Grid>
                </Content>
            </Container>
        )
    }
};

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

export default connect(mapStateToProps, mapDispatchToProps)(CardScreen)
