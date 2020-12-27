/**
 * @format
 */
require('react-native').unstable_enableLogBox();

import 'react-native-gesture-handler';
import {AppRegistry, Appearance} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
const colorScheme = Appearance.getColorScheme();
console.log('colorScheme :- ', colorScheme);


AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => {
    console.log('test');
    return Promise.resolve();
    });
    
AppRegistry.registerComponent(appName, () => App)