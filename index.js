/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import React from 'react';
import Store from './src/redux/Store';

const Root = () => (
    <Provider store={Store}>
        <App />
    </Provider>
);

AppRegistry.registerComponent(appName, () => Root);
