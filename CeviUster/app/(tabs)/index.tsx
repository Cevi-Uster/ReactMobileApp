import AppWebView from '@/components/ui/AppWebView';
import URLs from '@/constants/URLs';

export default function Screen() {
  return <AppWebView uri={URLs.WELCOME_URL} />;
}
