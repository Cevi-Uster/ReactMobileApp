import { AppRegistry } from 'react-native';
import App from './App';
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);
console.ignoredYellowBox = ['Remote debugger'];

// Polyfill to enable transfer of Multipart/Formdata over XHR requests. See https://stackoverflow.com/questions/44520812/react-native-xhr-multipart-form-data-send-data-as-object-object/46683077#46683077 for details.
global.FormData = global.originalFormData ? global.originalFormData : global.FormData;
AppRegistry.registerComponent('CeviUster', () => App);
