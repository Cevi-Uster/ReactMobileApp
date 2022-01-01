import React, { useRef } from "react";
import { AppState } from "react-native";
import { WebView } from 'react-native-webview';
import GLOBALS from '../Global';

export default class WebScreen extends React.Component {
  
  webView = null;
  focusListener = null;
  appStateListener = null;
  url = null;

  constructor(props){
    super(props);
    if (this.props.route.params ) {
      if (this.props.route.params.url){
        this.url = this.props.route.params.url;
      }
      if (this.props.route.params.title){
        console.log(this.props.route.params.title)
        this.props.navigation.setOptions({ title: this.props.route.params.title });
      } 
    }
  }

  componentDidMount() {
    console.log("WebScreen did mount")
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('focus', () => {
      console.log("WebScreen focus")
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
        console.log("WebScreen reload webView")
        this.webView.reload();
    }
  }

  render() {
    return (
      <WebView
        ref={(ref) => (this.webView = ref)}
        source={{uri: this.url}}
        style={{marginTop: 0}}
        scalesPageToFit={true}
      />
    );
  }
}
