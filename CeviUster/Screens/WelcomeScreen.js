import React from 'react';
import { WebView } from 'react-native-webview';
import Config from 'react-native-config';

export default class WelcomeScreen extends React.Component {
  render() {
    return (
      <WebView
        source={{uri: Config.WELCOME_URL}}
        style={{marginTop: 0}}
        scalesPageToFit={true}
      />
    );
  }
}
