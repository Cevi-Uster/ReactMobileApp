import React from 'react';
import { StyleSheet, WebView } from 'react-native';


export default class ContactScreen extends React.Component {
  render() {
    return (
      <WebView
        source={{uri: 'https://new.cevi-uster.ch/mobile-pages/kontakt/'}}
        style={{marginTop: 0}}
        scalesPageToFit={true}
      />
    );
  }
}
