import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { actions, selectors } from 'data/redux';
import ResponsesList from './components/ResponsesList';
import AssessmentsTable from './components/AssessmentsTable';

import './ReviewProblemStepsContent.scss';

export const ReviewProblemStepsContent = ({ toggleShowRubric }) => (
  <div className="review-problem-steps-content">
    <ResponsesList toggleShowRubric={toggleShowRubric} />
    <AssessmentsTable />
  </div>
);

ReviewProblemStepsContent.propTypes = {
  toggleShowRubric: PropTypes.func.isRequired,
};

export const mapDispatchToProps = {
  toggleShowRubric: actions.app.toggleShowRubric,
};

export const mapStateToProps = (state) => ({
  showRubric: selectors.app.showRubric(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(ReviewProblemStepsContent);
