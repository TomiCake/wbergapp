
import { AppRegistry } from 'react-native';
import App from './App';

AppRegistry.registerComponent('wbergapp', () => App);
if (window.document) {
    AppRegistry.runApplication('wbergapp', {
        initialProps: {},
        rootTag: document.getElementById('react-app')
    });
}