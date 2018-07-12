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
    Title,
    List,
    Text,
    ListItem,
    Icon,
} from 'native-base';

import * as Actions from '../../store/actions/index'; //Import your actions

class DeckScreen extends Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
        this.cardEdit = this.cardEdit.bind(this);
    }

    async componentDidMount() {
        await this.props.getAllDeckData({ where: { parentId: this.props.navigation.state.params.quiz.id } });
    }

    cardEdit(quiz, card) {
        this.props.navigation.navigate('Card', {
            quiz: quiz,
            card: card,
        });
    }

    async handleClick(navigation, quiz, cardDeck) {
        if (navigation == 'Home') {
            await this.props.getAllQuizData();
        }

        this.props.navigation.navigate(navigation, {
            quiz: quiz,
            cardDeck: cardDeck,
        });
    }

    render() {
        const { quiz } = this.props.navigation.state.params;
        const { cardDeck } = this.props;

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
                                <ListItem button={true} onPress={() => { this.cardEdit(quiz, c) }}>
                                    <Text>{c.question}</Text>
                                </ListItem>
                            }>
                        </List>
                    }
                </Content >

                <Footer >
                    <FooterTab>
                        <Button onPress={() => { this.handleClick('Card', quiz, []); }}>
                            <Text>New Question</Text>
                            <Icon name='ios-create' />
                        </Button>
                        {hasCardDeck &&
                            <Button onPress={() => { this.handleClick('StartQuiz', quiz, cardDeck); }}>
                                <Text>Start Quiz</Text>
                                <Icon name='ios-fastforward' />
                            </Button>
                        }
                        {!hasCardDeck &&
                            <Button disabled onPress={() => { this.handleClick('StartQuiz', quiz, cardDeck); }}>
                                <Text>Start Quiz</Text>
                                <Icon name='ios-fastforward' />
                            </Button>
                        }
                        <Button onPress={() => { this.handleClick('Home', quiz, []); }}>
                            <Text>Home</Text>
                            <Icon name='ios-home' />
                        </Button>
                    </FooterTab>
                </Footer>
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
