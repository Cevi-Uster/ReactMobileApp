import React from 'react';
import { WebView } from 'react-native-webview';
import GLOBALS from '../Global';

export default class ContactScreen extends React.Component {

  constructor(props){
    super(props);
    this.props.navigation.setOptions({ title: "Kontakt" });
  }

  render() {
    return (
      <WebView
        source={{uri: GLOBALS.CONTACT_URL}}
        style={{marginTop: 0}}
        scalesPageToFit={true}
      />
    );
  }
}
