import React from 'react';
import { WebView } from 'react-native-webview';
import GLOBALS from '../Global';

export default class ContactScreen extends React.Component {

  webView = null;
  focusListener = null;

  constructor(props){
    super(props);
    this.props.navigation.setOptions({ title: "Kontakt" });
  }

  componentDidMount() {
    console.log("ContactScreen did mount")
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('focus', () => {
      console.log("ContactScreen focus")
      if (this.webView){
        console.log("ContactScreen reload webView")
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
        source={{uri: GLOBALS.CONTACT_URL}}
        ref={(ref) => (this.webView = ref)}
        style={{marginTop: 0}}
        scalesPageToFit={true}
      />
    );
  }
}
