import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Footer from '@edx/frontend-component-footer';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import { routePath } from 'data/constants/app';
import store from 'data/store';
import ListView from 'containers/ListView';
import messages from './i18n';
import './App.scss';

import { AppProvider, ErrorPage, PageRoute } from '@edx/frontend-platform/react';
import Header from './course-header/Header';


const App = () => (
  <IntlProvider locale="en" messages={messages.en} >
    <AppProvider store={store}>
      <Router>
        <div>
          <Header
            courseOrg='Course org'
            courseNumber='Course Number'
            courseTitle='Course Title'
          />
          <main>
            <ListView />
          </main>
          <Footer logo={process.env.LOGO_POWERED_BY_OPEN_EDX_URL_SVG} />
        </div>
      </Router>
    </AppProvider>
  </IntlProvider>
);

export default App;
