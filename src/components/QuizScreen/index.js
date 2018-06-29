'use strict';

import React, { Component } from 'react';
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
} from 'native-base';

class QuizScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: ''
        }

        this.createQuiz = this.createQuiz.bind(this);
    }

    async createQuiz() {
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
                    
                    <Button small full transparent onPress={() => { this.createQuiz(); }}>
                        <Text>Create</Text>
                    </Button>
                </Content>
            </Container>
        )
    }
};

export default QuizScreen
