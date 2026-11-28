import AppWebView from '@/components/ui/AppWebView';
import URLs from '@/constants/URLs';

export default function Screen() {
  return <AppWebView uri={URLs.PRIVACY_STATEMENT_URL} />;
}
