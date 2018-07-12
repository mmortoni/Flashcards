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
} from 'native-base';

import * as Actions from '../../store/actions/index';

class QuizScreen extends Component {
    constructor(props) {
        super(props);

        const quiz = this.props.navigation.state.params.quiz;

        this.state = {
            title: quiz ? quiz.title : '',
        }

        this.editDeck = this.editDeck.bind(this);
    }

    async editDeck() {
        const quiz = this.props.navigation.state.params.quiz;
        const { title } = this.state;
        if (title.trim().length == 0) return;

        const result = await DB.quiz.find({ where: { title: title } });

        if (quiz) {
            await DB.quiz.updateById({ title: title }, quiz.id);
            await this.props.getAllQuizData();

            this.props.navigation.navigate('Home', {});
        } else {
            if (result.length > 0) {
                alert('Title already exists!');
                return;
            }

            const quiz = await DB.quiz.add({ id: '', title: title, cardDeck: [] });

            this.props.navigation.navigate('Deck', {
                quiz: quiz,
            });
        }
    }

    render() {
        const { title } = this.state;
        const { quiz } = this.props.navigation.state.params;

        return (
            <Container>
                <Header>
                    <Body>
                        <Title>Quiz</Title>
                    </Body>
                </Header>
                <Content padder>
                    <Form>
                        <Item>
                            <Label>Title:</Label>
                            <Input onChangeText={title => this.setState({ title })} value={this.state.title}/>
                        </Item>
                    </Form>
                </Content>

                <Footer >
                    <FooterTab>
                        <Left>
                            <Button onPress={() => this.editDeck()}>
                                <Icon name="ios-create" />
                                <Text>{quiz ? 'Edit' : 'Create'}</Text>
                            </Button>
                        </Left>
                    </FooterTab>
                </Footer>
            </Container>
        )
    }
};
const mapStateToProps = (state) => {
    return {
      pending: state.ui.pending,
      data: state.quiz
    }
  }
  
  function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
  }
  
export default connect(mapStateToProps, mapDispatchToProps)(QuizScreen)
