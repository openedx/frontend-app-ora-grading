import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Col, Row } from '@edx/paragon';

import { selectors } from 'data/redux';

import ResponseDisplay from 'containers/ResponseDisplay';
import Rubric from 'containers/Rubric';

/**
 * <ReviewContent />
 */
export const ReviewContent = ({ showRubric }) => (
  <div className="content-block">
    <Row className="flex-nowrap">
      <Col><ResponseDisplay /></Col>
      { showRubric && <Rubric /> }
    </Row>
  </div>
);
ReviewContent.defaultProps = {
  showRubric: false,
};
ReviewContent.propTypes = {
  showRubric: PropTypes.bool,
};

export const mapStateToProps = (state) => ({
  showRubric: selectors.app.showRubric(state),
});

export const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ReviewContent);
