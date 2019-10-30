import { observable, observe } from "mobx";
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View, Keyboard } from 'react-native';


export default class DropOutScreen extends React.Component {

    state = observable({
        stufe: null,
        destinationEmail: null,
        your_name:null,
    });

    disposer = observe(this.state, (change) => {
        console.log(change.type, change.name, "from", change.oldValue, "to", change.object[change.name]);
    });

    static navigationOptions = ({ navigation }) => ({
        title: typeof (navigation.state.params) === 'undefined' || typeof (navigation.state.params.title) === 'undefined' ? 'undefined' : navigation.state.params.title,
    });

    constructor(props) {
        super(props);
        console.log(props);
        if (this.props.navigation.state.params && this.props.navigation.state.params.parentStufe) {
            this.state.stufe = this.props.navigation.state.params.parentStufe;
            this.state.destinationEmail = this.props.navigation.state.params.destinationEmail;
        }
        this.props.navigation.setParams({ title: "Abmeldung" });
    }

    render() {
        return (
            <ScrollView>
                <View style={styles.container}>

                    <Text
                        style={styles.title}>
                        {this.state.stufe.name}
                    </Text>
                    <Text>Dein Name*</Text>
                    <TextInput
                        onChangeText={(your_name) => this.setState({your_name})}
                        onBlur={Keyboard.dismiss}
                        value={this.state.your_name}
                    />
                    {/*<Text>Deine E-Mailadresse*</Text>
                    <TextInput
                        name={'your-email'}
                    />
                    <Text>Betreff*</Text>
                    <TextInput
                        name={'your-subject'}
                    />
                    <Text>Deine Nachricht</Text>
                    <TextInput
                        name={'your-message'}
                    />
                    <Text>Ich stimme der Datenverwendung für diese Nachricht zu</Text>
                    <CheckBox
                        name={'acceptance'}
                    />
                    <TouchableOpacity onPress={this.handleSubmit}>
                        <Text>Senden</Text>
                    </TouchableOpacity>*/}
                </View>
            </ScrollView>
        );
    }

    handleSubmit(values) {
        return Alert.alert('Submitted!', JSON.stringify(values));
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
    },
    inputContainer: {
        paddingTop: 15
    },
    TextInput: {
        borderColor: '#CCCCCC',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        height: 50,
        fontSize: 25,
        paddingLeft: 20,
        paddingRight: 20
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    Text: {
        fontSize: 14,
    }, 
});