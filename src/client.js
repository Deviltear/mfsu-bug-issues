/* @flow */

import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { renderRoutes } from 'react-router-config';
import { loadableReady } from '@loadable/component';

import 'react-resizable/css/styles.css';

import routes from './routes';
import App from './app';
// Get the initial state from server-side rendering
const initialState = window.__INITIAL_STATE__;

// __webpack_nonce__ = 'c29tZSBjb29sIHN0cmluZyB3aWxsIHBvcCB1cCAxMjM=';

const render = (Routes) => {
  const renderMethod = module.hot ? ReactDOM.render : ReactDOM.hydrate;

  renderMethod(
    <AppContainer>
      <App />
    </AppContainer>,
    document.getElementById('react-view'),
  );
};

// loadable-component setup
loadableReady(() => {
  render(routes);
});

if (module.hot) {
  // Enable webpack hot module replacement for routes
  module.hot.accept('./routes', () => {
    try {
      const nextRoutes = require('./routes').default;

      render(nextRoutes);
    } catch (error) {
      console.error(`==> 😭  Routes hot reloading error ${error}`);
    }
  });
}
