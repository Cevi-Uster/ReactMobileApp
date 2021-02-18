import React from 'react';
import { WebView } from 'react-native-webview';
import GLOBALS from '../Global';


export default class PrivacyStatementScreen extends React.Component {
  render() {
    return (
      <WebView
        source={{uri: GLOBALS.PRIVACY_STATEMENT_URL}}
        style={{marginTop: 0}}
        scalesPageToFit={true}
      />
    );
  }
}
