import React from 'react';
import DropOutForm from '../Forms/DropOutForm/DropOutForm'
import { StyleSheet, ScrollView, View, Text, Image, Dimensions } from 'react-native';


export default class DropOutScreen extends React.Component {
    state = observable({
        stufe: null,
        destinationEmail: null
    });

    disposer = observe(this.state, (change) => {
        console.log(change.type, change.name, "from", change.oldValue, "to", change.object[change.name]);
    });

    static navigationOptions = ({ navigation }) => ({
        title: typeof (navigation.state.params) === 'undefined' || typeof (navigation.state.params.title) === 'undefined' ? 'find' : navigation.state.params.title,
    });

    constructor(props) {
        super(props);
        console.log(props);
        if (this.props.navigation.state.params && this.props.navigation.state.params.parentStufe) {
            this.state.stufe = this.props.navigation.state.params.parentStufe;
            this.state.destinationEmail = this.props.navigation.state.destinationEmail;
            this.props.navigation.setParams({ title: this.props.navigation.state.params.parentStufe.name });
        } else {
            this.props.navigation.setParams({ title: "Unknown" });
        }
    }

    render() {
        return <DropOutForm onSubmit={(values) => Alert.alert('Submitted!', JSON.stringify(values))} />;
    }
}