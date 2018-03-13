import React from 'react';
import { StyleSheet, WebView } from 'react-native';


export default class ContactScreen extends React.Component {
  render() {
    return (
      <WebView
        source={{uri: 'https://www.cevi-uster.ch/iApp/contact.html'}}
        style={{marginTop: 0}}
      />
    );
  }
}
