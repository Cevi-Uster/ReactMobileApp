import React, { useRef } from "react";
import { AppState } from "react-native";
import { WebView } from 'react-native-webview';
import GLOBALS from '../Global';

export default class WelcomeScreen extends React.Component {
  
  webView = null;
  focusListener = null;
  appStateListener = null;

  constructor(props){
    super(props);
    this.props.navigation.setOptions({ title: "Willkommen" });
  }

  componentDidMount() {
    console.log("WelcomeScreen did mount")
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('focus', () => {
      console.log("WelcomeScreen focus")
      this.refresh();
    });

    this.appStateListener = AppState.addEventListener("change", nextAppState => {
      if (AppState.currentState.match(/inactive|background/) &&  nextAppState === "active") {
        console.log("App has come to the foreground!");
        this.refresh();
      }
    });
  }

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
    this.appStateListener.remove();
  }

  refresh() {
    if (this.webView){
        console.log("WelcomeScreen reload webView")
        this.webView.reload();
    }
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
