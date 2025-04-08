import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Col, Row } from '@openedx/paragon';

import { selectors } from '@src/data/redux';
import { RequestKeys } from '@src/data/constants/requests';

import ResponseDisplay from '@src/containers/ResponseDisplay';
import Rubric from '@src/containers/Rubric';
import ReviewErrors from './ReviewErrors';

/**
 * <ReviewContent />
 */
export const ReviewContent = ({ isFailed, isLoaded, showRubric }) => (isLoaded || isFailed) && (
<div className="content-block">
  <div className="content-wrapper">
    <ReviewErrors />
    {isLoaded && (
    <Row className="flex-nowrap m-0">
      <Col className="p-0">
        <ResponseDisplay />
      </Col>
      {showRubric && <Rubric />}
    </Row>
    )}
  </div>
</div>
);
ReviewContent.defaultProps = {
  isFailed: false,
  isLoaded: false,
  showRubric: false,
};
ReviewContent.propTypes = {
  isFailed: PropTypes.bool,
  isLoaded: PropTypes.bool,
  showRubric: PropTypes.bool,
};

export const mapStateToProps = (state) => ({
  isFailed: selectors.requests.isFailed(state, {
    requestKey: RequestKeys.fetchSubmission,
  }),
  isLoaded: selectors.requests.isCompleted(state, {
    requestKey: RequestKeys.fetchSubmission,
  }),
  showRubric: selectors.app.showRubric(state),
});

export const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ReviewContent);
