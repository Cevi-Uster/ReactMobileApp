import React from 'react';
import { WebView } from 'react-native-webview';
import GLOBALS from '../Global';


export default class PrivacyStatementScreen extends React.Component {

  constructor(props){
    super(props);
    this.props.navigation.setOptions({ title: "Datenschutzerklärung" });
  }

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
