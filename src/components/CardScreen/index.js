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

            this.setState({
                question: '',
                answer: '',
            })

            alert('Card successfully created!');
        } else {
            alert('Error creating card!');
        }
    }

/*
Para fins de nomeação

Quando um novo cartão (pergunta e resposta) é criado, notei que ao voltar para o deck individual o estado com o novo numero de questões não é atualizado.
Você pode dar uma analisada tanto nos reducers como no middleware para ter uma ideia melhor de como os dados estão chegando após o dispactch dessa action.
*/
    async componentWillUnmount() {
        await this.props.getAllDeckData({ where: { parentId: this.props.navigation.state.params.quiz.id } });
    }

    async exitCardScreen(quiz) {
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
                </Content>

                <Footer >
                    <FooterTab>
                        <Left>
                            <Button onPress={() => this.createCard(quiz.id)}>
                                <Icon name="ios-create" />
                                <Text>Create</Text>
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
