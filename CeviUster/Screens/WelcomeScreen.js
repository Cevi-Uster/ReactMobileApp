import React from 'react';
import { WebView } from 'react-native-webview';
import GLOBALS from '../Global';

export default class WelcomeScreen extends React.Component {
  
  constructor(props){
    super(props);
    this.props.navigation.setOptions({ title: "Willkommen" });
  }

  render() {
    return (
      <WebView
        source={{uri: GLOBALS.WELCOME_URL}}
        style={{marginTop: 0}}
        scalesPageToFit={true}
      />
    );
  }
}
