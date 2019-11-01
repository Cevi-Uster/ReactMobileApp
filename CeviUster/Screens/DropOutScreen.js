import { observable, observe } from "mobx";
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View, Keyboard } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { COLOR_PRIMARY, COLOR_SECONDARY, BORDER_RADIUS } from '../styles/common.js'
import { Button } from 'react-native-elements';


export default class DropOutScreen extends React.Component {

    state = observable({
        stufe: null,
        destinationEmail: null,
        your_name:null,
        your_email:null,
        your_subject: 'ich möchte mich für das nächste Programm abmelden',
        your_message: null,
        acceptance: false,

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
                        Abmeldung
                    </Text>
                    <Text
                        style={styles.subtitle}>
                        für das nächste Programm der Stufe {this.state.stufe.name}
                    </Text>
                    <Text style={styles.text}>Dein Name*</Text>
                    <TextInput
                        style={styles.text_input}
                        onChangeText={(your_name) => this.setState({[your_name]: your_name})}
                        onBlur={Keyboard.dismiss}
                        value={this.state.your_name}
                    />
                    <Text style={styles.text} >Deine E-Mailadresse*</Text>
                    <TextInput
                        style={styles.text_input}
                        keyboardType='email-address'
                        onChangeText={(your_email) => this.setState({[your_email]: your_email})}
                        value={this.state.your_name}
                    />
                    <Text style={styles.text}>Deine Nachricht</Text>
                    <TextInput
                        style={styles.multiline_text_input}
                        onChangeText={(your_message) => this.setState({[your_message]: your_message})}
                        onBlur={Keyboard.dismiss}
                        value={this.state.your_message}
                        multiline={true}
                    
                    />
                    <CheckBox
                        checked={this.state.acceptance}
                        onPress={() => this.setState({acceptance: !this.state.acceptance})}
                        title='Ich stimme der Datenverwendung für diese Nachricht zu'
                    />
                </View>
                <View style={styles.buttonview}>
                <Button
                  style={styles.sendButton}
                  onPress={() => { this.handleSubmit() }}
                  buttonStyle={{
                    backgroundColor: COLOR_PRIMARY,
                    width: 140,
                    height: 50,
                    borderColor: "transparent",
                    borderWidth: 0,
                    borderRadius: BORDER_RADIUS
                  }}
                  title='Senden'
                />
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
    text_input: {
        borderColor: '#CCCCCC',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        height: 50,
        fontSize: 25,
        paddingLeft: 20,
        paddingRight: 20
    },
    multiline_text_input: {
        borderColor: '#CCCCCC',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        height: 150,
        fontSize: 25,
        paddingLeft: 20,
        paddingRight: 20
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 20,
    },
    text: {
        paddingTop: 15,
        fontSize: 18,
        fontWeight: 'bold',
    }, 
    buttonview: {
        marginTop: 10,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
      },
    sendButton: {
        marginTop: 10,
    },
});