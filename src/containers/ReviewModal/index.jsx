import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  FullscreenModal,
  Container,
} from '@edx/paragon';

import createDOMPurify from 'dompurify';
import parse from 'html-react-parser';

import selectors from 'data/selectors';
import actions from 'data/actions';
import thunkActions from 'data/thunkActions';

import ReviewActions from './ReviewActions';

import './ReviewModal.scss';

/**
 * <ReviewModal />
 */
export class ReviewModal extends React.Component {
  constructor(props) {
    super(props);
    console.log('review modal');
    console.log({ props });
    this.purify = createDOMPurify(window);
    this.onClose = this.onClose.bind(this);
  }

  get textContent() {
    return parse(this.purify.sanitize(this.props.response.text));
  }

  onClose() {
    this.props.setShowReview(false);
  }

  render() {
    return (
      <FullscreenModal
        title={this.props.oraName}
        isOpen={this.props.isOpen}
        beforeBodyNode={<ReviewActions />}
        onClose={this.onClose}
      >
        <Container size="md">
          {this.textContent}
        </Container>
      </FullscreenModal>
    );
  }
}
ReviewModal.defaultProps = {};
ReviewModal.propTypes = {
  oraName: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  response: PropTypes.shape({
    text: PropTypes.node,
  }).isRequired,
  setShowReview: PropTypes.func.isRequired,
};

export const mapStateToProps = (state) => ({
  isOpen: selectors.app.showReview(state),
  oraName: selectors.app.oraName(state),
  response: selectors.submissions.selectedResponse(state),
});

export const mapDispatchToProps = {
  setShowReview: actions.app.setShowReview,
};

export default connect(mapStateToProps, mapDispatchToProps)(ReviewModal);
