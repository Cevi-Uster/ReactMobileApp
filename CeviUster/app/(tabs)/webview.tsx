import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import { StyleSheet } from 'react-native';
import { useNavigation, useRouter, useLocalSearchParams } from "expo-router";

export default function App() {
  const navigation = useNavigation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { url } = params;
  return (
    <WebView
      style={styles.container}
      source={{ uri: url}}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //marginTop: Constants.statusBarHeight,
  },
});
