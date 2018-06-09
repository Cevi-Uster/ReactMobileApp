import { AppRegistry } from 'react-native';
import App from './App';
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);
console.ignoredYellowBox = ['Remote debugger'];
AppRegistry.registerComponent('CeviUster', () => App);
