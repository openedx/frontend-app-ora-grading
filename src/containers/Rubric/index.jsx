import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  Card,
  Button,
} from '@edx/paragon';

/**
 * <GradingRubric />
 */
export const Rubric = ({
}) => {
  return (
    <Card className="grading-rubric-card">
      <Card.Body className="grading-rubric-body" />
      <div className="grading-rubric-footer">
        <Button>Submit Grade</Button>
      </div>
    </Card>
  );
}
Rubric.defaultProps = {};
Rubric.propTypes = {};

export const mapStateToProps = (state) => ({
});

export const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Rubric);
