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
    Picker,
} from 'native-base';

import * as Actions from '../../store/actions/index';

class StartQuizScreen extends Component {
    constructor(props) {
        super(props);

        this.state = { index: 0, question: 'correct' }

        this.handleClick = this.handleClick.bind(this);
    }

    async componentDidMount() {
        //       await this.props.getAllDeckData({ where: { parentId: this.props.navigation.state.params.quiz.id } });
    }

    async handleClick() {
        const { cardDeck } = this.props.navigation.state.params;
        if (this.state.index < cardDeck.length - 1) {
            this.setState({ index: this.state.index + 1 })
        }
    }

    render() {
        const { quiz, cardDeck } = this.props.navigation.state.params;

        return (
            <Container>
                <Header>
                    <Body>
                        <Title>{quiz.title + ' - ' + (this.state.index + 1) + '/' + cardDeck.length} cards</Title>
                    </Body>
                </Header>

                <Content>
                    <Card>
                        <CardItem>
                            <Body>
                                <Text disabled>{cardDeck[this.state.index].question}</Text>
                            </Body>
                        </CardItem>
                    </Card>
                    <Card>
                        <CardItem>
                            <Body>
                                <Text>{cardDeck[this.state.index].answer}</Text>
                            </Body>
                        </CardItem>
                        <CardItem>
                            <Picker
                                selectedValue={this.state.question}
                                onValueChange={(itemValue, itemIndex) => this.setState({ question: itemValue })}>
                                <Picker.Item label="Correct" value="correct" />
                                <Picker.Item label="Incorrect" value="incorrect" />
                            </Picker>
                        </CardItem>
                    </Card>
                    <Card>
                        <CardItem>
                            <Body>
                                <Text>Score - ios-stats</Text>
                            </Body>
                        </CardItem>
                    </Card>
                    <Card>
                        <CardItem style={{ justifyContent: 'space-between' }}>
                            <Left>
                                <Button transparent>
                                    <Text>Restart Quiz</Text>
                                    <Icon active name="ios-rewind" />
                                </Button>
                            </Left>
                            <Right>
                                <Button transparent>
                                    <Text>Back to Deck</Text>
                                    <Icon active name="ios-skip-backward" />
                                </Button>
                            </Right>
                        </CardItem>
                    </Card>
                </Content>

                <Footer >
                    <FooterTab>
                        <Left>
                            <Button onPress={() => { this.handleClick(); }}>
                                <Text>Show Answer</Text>
                                <Icon name='ios-eye' />
                            </Button>
                        </Left>
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
