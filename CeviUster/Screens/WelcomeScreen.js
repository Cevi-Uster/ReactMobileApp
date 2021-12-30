import React from 'react';
import { WebView } from 'react-native-webview';
import GLOBALS from '../Global';

export default class WelcomeScreen extends React.Component {
  
  webView = null;
  focusListener = null;

  constructor(props){
    super(props);
    this.props.navigation.setOptions({ title: "Willkommen" });
  }

  componentDidMount() {
    console.log("WelcomeScreen did mount")
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('focus', () => {
      console.log("WelcomeScreen focus")
      if (this.webView){
        console.log("WelcomeScreen reload webView")
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
        ref={(ref) => (this.webView = ref)}
        source={{uri: GLOBALS.WELCOME_URL}}
        style={{marginTop: 0}}
        scalesPageToFit={true}
      />
    );
  }
}
