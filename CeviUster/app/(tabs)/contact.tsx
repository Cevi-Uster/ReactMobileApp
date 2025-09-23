import { WebView } from 'react-native-webview';
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
