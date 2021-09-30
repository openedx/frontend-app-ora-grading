import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  Card,
  Button,
} from '@edx/paragon';

import selectors from 'data/selectors';

import CriterionContainer from 'containers/CriterionContainer';
import RubricFeedback from './RubricFeedback';

import './Rubric.scss';

/**
 * <Rubric />
 */
export const Rubric = ({
  isGrading,
  criteriaIndices,
}) => (
  <Card className="grading-rubric-card">
    <Card.Body className="grading-rubric-body">
      <h3>Rubric</h3>
      <hr />
      { criteriaIndices.map(index => (
        <CriterionContainer isGrading={isGrading} key={index} orderNum={index} />
      )) }
      <hr />
      <RubricFeedback />
    </Card.Body>
    { isGrading && (
      <div className="grading-rubric-footer">
        <Button>Submit Grade</Button>
      </div>
    )}
  </Card>
);
Rubric.defaultProps = {
  criteriaIndices: [],
};
Rubric.propTypes = {
  isGrading: PropTypes.bool.isRequired,
  criteriaIndices: PropTypes.arrayOf(PropTypes.number),
};

export const mapStateToProps = (state) => ({
  isGrading: selectors.app.isGrading(state),
  criteriaIndices: selectors.app.rubricCriteriaIndices(state),
});

export const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Rubric);
