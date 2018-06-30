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
    Right
} from 'native-base';

import * as Actions from '../../store/actions/index';

class StartQuizScreen extends Component {
    constructor(props) {
        super(props);

        this.state = { index: 0 }

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
                                <Text>{cardDeck[this.state.index].question}</Text>
                            </Body>
                        </CardItem>
                    </Card>

                    <Card>
                        <CardItem>
                            <Body>
                                <Text>{cardDeck[this.state.index].answer}</Text>
                            </Body>
                        </CardItem>
                    </Card>
                </Content>

                <Footer >
                    <FooterTab>
                        <Card>
                            <CardItem button small full transparent onPress={() => { this.handleClick(); }}>
                                <Right>
                                    <Icon name="arrow-forward" style={{ color: "#999" }} />
                                </Right>
                            </CardItem>
                        </Card>
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