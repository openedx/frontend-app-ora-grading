import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import FooterSlot from '@openedx/frontend-slot-footer';
import { LearningHeader as Header } from '@edx/frontend-component-header';

import { selectors } from 'data/redux';

import DemoWarning from 'containers/DemoWarning';
import CTA from 'containers/CTA';
import NotificationsBanner from 'containers/NotificationsBanner';
import ListView from 'containers/ListView';
import { MathJaxContext } from 'better-react-mathjax';

import './App.scss';
import Head from './components/Head';

export const App = ({ courseMetadata, isEnabled }) => (
  <Router>
    <div>
      <Head />
      <Header
        courseTitle={courseMetadata.title}
        courseNumber={courseMetadata.number}
        courseOrg={courseMetadata.org}
        data-testid="header"
      />
      {!isEnabled && <DemoWarning />}
      <CTA />
      <NotificationsBanner />
      <main data-testid="main">
        <MathJaxContext>
          <ListView />
        </MathJaxContext>
      </main>
      <FooterSlot />
    </div>
  </Router>
);
App.defaultProps = {
  courseMetadata: {
    title: '',
    number: null,
    org: '',
  },
};
App.propTypes = {
  courseMetadata: PropTypes.shape({
    title: PropTypes.string,
    number: PropTypes.string,
    org: PropTypes.string,
  }),
  isEnabled: PropTypes.bool.isRequired,
};

export const mapStateToProps = (state) => ({
  courseMetadata: selectors.app.courseMetadata(state),
  isEnabled: selectors.app.isEnabled(state),
});

export default connect(mapStateToProps)(App);
