import React, { useRef } from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { ErrorView, LoadingView } from './StateView';

export default function AppWebView({ uri }: { uri: string }) {
  const ref = useRef<React.ComponentRef<typeof WebView>>(null);
  return (
    <WebView
      ref={ref}
      style={styles.container}
      source={{ uri }}
      startInLoadingState
      pullToRefreshEnabled
      renderLoading={() => <LoadingView />}
      renderError={() => <ErrorView onRetry={() => ref.current?.reload()} />}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
