import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import { StyleSheet } from 'react-native';
import URLs from '../../constants/URLs';


export default function DataProtectionPolicy() {
  const styles = require('../../constants/ViewStyles');
  return (
    <WebView
      source={{ uri: URLs.PRIVACY_STATEMENT_URL }}
    />
  );
}
