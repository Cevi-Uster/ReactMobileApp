import React from 'react';
import { WebView } from 'react-native-webview';
import Config from 'react-native-config';


export default class ContactScreen extends React.Component {
  render() {
    return (
      <WebView
        source={{uri: Config.CONTACT_URL}}
        style={{marginTop: 0}}
        scalesPageToFit={true}
      />
    );
  }
}
