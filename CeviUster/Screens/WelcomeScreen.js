import React from 'react';
import { StyleSheet, WebView } from 'react-native';

export default class WelcomeScreen extends React.Component {
  render() {
    return (
      <WebView
        source={{uri: 'https://www.cevi-uster.ch/iApp/welcome_ipad.html'}}
        style={{marginTop: 0}}
        scalesPageToFit={true}
      />
    );
  }
}
