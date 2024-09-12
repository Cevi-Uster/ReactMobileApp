import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import { StyleSheet } from 'react-native';
import URLs from '../../constants/URLs';


export default function Contact() {
  const styles = require('../../constants/ViewStyles');
  return (
    <WebView
      style={styles.container}
      source={{ uri: URLs.CONTACT_URL }}
    />
  );
}
