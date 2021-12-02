import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { FullscreenModal } from '@edx/paragon';

import { selectors, actions } from 'data/redux';
import { RequestKeys } from 'data/constants/requests';

import LoadingMessage from 'components/LoadingMessage';
import ReviewActions from 'containers/ReviewActions';
import ReviewContent from './ReviewContent';
import messages from './messages';

import './ReviewModal.scss';

/**
 * <ReviewModal />
 */
export class ReviewModal extends React.Component {
  constructor(props) {
    super(props);
    this.onClose = this.onClose.bind(this);
  }

  onClose() {
    this.props.setShowReview(false);
  }

  get isLoading() {
    return !(this.props.errorStatus || this.props.isLoaded);
  }

  render() {
    const { isOpen, isLoaded, errorStatus } = this.props;
    return (
      <FullscreenModal
        title={this.props.oraName}
        isOpen={isOpen}
        beforeBodyNode={<ReviewActions />}
        onClose={this.onClose}
        className="review-modal"
        modalBodyClassName="review-modal-body"
      >
        {isOpen && <ReviewContent />}
        {/* even if the modal is closed, in case we want to add transitions later */}
        {!(isLoaded || errorStatus) && <LoadingMessage message={messages.loadingResponse} />}
      </FullscreenModal>
    );
  }
}
ReviewModal.defaultProps = {
  errorStatus: null,
  response: null,
};
ReviewModal.propTypes = {
  oraName: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  response: PropTypes.shape({
    text: PropTypes.node,
  }),
  setShowReview: PropTypes.func.isRequired,
  isLoaded: PropTypes.bool.isRequired,
  errorStatus: PropTypes.number,
};

export const mapStateToProps = (state) => ({
  isOpen: selectors.app.showReview(state),
  oraName: selectors.app.ora.name(state),
  response: selectors.grading.selected.response(state),
  isLoaded: selectors.requests.isCompleted(state, { requestKey: RequestKeys.fetchSubmission }),
  errorStatus: selectors.requests.errorStatus(state, { requestKey: RequestKeys.fetchSubmission }),
});

export const mapDispatchToProps = {
  setShowReview: actions.app.setShowReview,
};

export default connect(mapStateToProps, mapDispatchToProps)(ReviewModal);
