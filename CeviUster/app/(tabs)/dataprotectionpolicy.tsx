import { WebView } from 'react-native-webview';
import URLs from '../../constants/URLs';

export default function DataProtectionPolicy() {
  const styles = require('../../constants/ViewStyles');
  return (
    <WebView
      style={styles.container}
      source={{ uri: URLs.PRIVACY_STATEMENT_URL }}
    />
  );
}
