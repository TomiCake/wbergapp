import { AppRegistry } from 'react-native';
import App from './App';

AppRegistry.registerComponent('wbergapp', () => App);
AppRegistry.runApplication('wbergapp', {
    initialProps: {},
    rootTag: document.getElementById('react-app')
});