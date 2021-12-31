import React from 'react';
import { AppState, StyleSheet, Text, View } from "react-native";
import { WebView } from 'react-native-webview';
import GLOBALS from '../Global';


export default class PrivacyStatementScreen extends React.Component {

  webView = null;
  focusListener = null;

  constructor(props){
    super(props);
    this.props.navigation.setOptions({ title: "Datenschutzerklärung" });
  }

  componentDidMount() {
    console.log("PrivacyStatementScreen did mount")
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('focus', () => {
      console.log("PrivacyStatementScreen focus")
      if (this.webView){
        console.log("PrivacyStatementScreen reload webView")
        this.webView.reload();
      }
    });
  }

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  }

  render() {
    return (
      <WebView
        source={{uri: GLOBALS.PRIVACY_STATEMENT_URL}}
        ref={(ref) => (this.webView = ref)}
        style={{marginTop: 0}}
        scalesPageToFit={true}
      />
    );
  }
}
