import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React from 'react';
import ReactDOM from 'react-dom';

import {
  APP_READY,
  APP_INIT_ERROR,
  initialize,
  subscribe,
} from '@edx/frontend-platform';
import { messages as footerMessages } from '@edx/frontend-component-footer';

import appMessages from './i18n';
import App from './App';

/*
subscribe(APP_READY, () => {
  ReactDOM.render(<App />, document.getElementById('root'));
});

initialize({
  messages: [
    appMessages,
    footerMessages,
  ],
  requireAuthenticatedUser: true,
});
*/

// ReactDOM.render(
//   <IntlProvider locale="en">
//     <App />
//   </IntlProvider>,
//   document.getElementById('root'),
// );

subscribe(APP_READY, () => {
  ReactDOM.render(<App />, document.getElementById('root'));
});

subscribe(APP_INIT_ERROR, (error) => {
  ReactDOM.render(<ErrorPage message={error.message} />, document.getElementById('root'));
});

initialize({
  messages: [
    appMessages,
    footerMessages,
  ],
  requireAuthenticatedUser: true,
});