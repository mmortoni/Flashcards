'use strict';

import React, { Component } from 'react';
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
} from 'native-base';

class QuizScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: ''
        }

        this.createDeck = this.createDeck.bind(this);
    }

    async createDeck() {
        const { title } = this.state;
        if (title.trim().length == 0) return;

        const result = await DB.quiz.find({ where: { title: title } });

        if (result !== null) {
            alert('Title already exists!');
            return;
        }

        const quiz = await DB.quiz.add({ id: '', title: title, cardDeck: [] });

        this.props.navigation.navigate('Card', {
            quiz: quiz,
        });
    }

    render() {
        const { title } = this.state;

        return (
            <Container>
                <Header>
                    <Body>
                        <Title>New Quiz</Title>
                    </Body>
                </Header>
                <Content padder>
                    <Form>
                        <Item>
                            <Label>Title:</Label>
                            <Input onChangeText={title => this.setState({ title })} />
                        </Item>
                    </Form>
                </Content>

                <Footer >
                    <FooterTab>
                        <Left>
                            <Button onPress={() => this.createDeck()}>
                                <Icon name="ios-create" />
                                <Text>Create Deck</Text>
                            </Button>
                        </Left>
                    </FooterTab>
                </Footer>
            </Container>
        )
    }
};

export default QuizScreen
