import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { ScrollView, Text } from 'react-native';

import CeviTextInput from '../CeviTextInput';
import CeviCheckBox from '../CeviCheckBox';

function DropOutForm() {
    return (
        <ScrollView keyboardShouldPersistTaps={'handled'}>
            <Text>Dein Name*</Text>
            <Field
                name={'your-name'}
                component={CeviTextInput}
            />
            <Text>Deine E-Mailadresse*</Text>
            <Field
                name={'your-email'}
                component={CeviTextInput}
            />
            <Text>Betreff*</Text>
            <Field
                name={'your-subject'}
                component={CeviTextInput}
            />
            <Text>Deine Nachricht</Text>
            <Field
                name={'your-message'}
                component={CeviTextInput}
            />
            <Text>Ich stimme der Datenverwendung für diese Nachricht zu</Text>
            <Field
                name={'acceptance'}
                component={CeviCheckBox}
            />
            <TouchableOpacity onPress={props.handleSubmit}>
                <Text>Senden</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

export default reduxForm({ form: 'dropOut' })(DropOutForm);