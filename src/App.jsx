import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import Footer from '@edx/frontend-component-footer';

import { selectors } from 'data/redux';

import ListView from 'containers/ListView';
import './App.scss';

import Header from 'containers/CourseHeader';

export const App = ({ courseMetadata }) => (
  <Router>
    <div>
      <Header
        courseTitle={courseMetadata.title}
        courseNumber={courseMetadata.number}
        courseOrg={courseMetadata.org}
      />
      <main>
        <ListView />
      </main>
      <Footer logo={process.env.LOGO_POWERED_BY_OPEN_EDX_URL_SVG} />
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
};

export const mapStateToProps = (state) => ({
  courseMetadata: selectors.app.courseMetadata(state),
});

export default connect(mapStateToProps)(App);
