import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { FullscreenModal } from '@edx/paragon';

import { selectors, actions } from 'data/redux';
import { RequestKeys } from 'data/constants/requests';

import LoadingMessage from 'components/LoadingMessage';
import ReviewActions from 'containers/ReviewActions';
import ReviewError from './ReviewError';
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
    return !(this.props.hasError || this.props.isLoaded);
  }

  render() {
    const { isOpen, isLoaded, hasError } = this.props;
    return (
      <FullscreenModal
        title={this.props.oraName}
        isOpen={isOpen}
        beforeBodyNode={<ReviewActions />}
        onClose={this.onClose}
        className="review-modal"
        modalBodyClassName="review-modal-body"
      >
        {isOpen && (
          <>
            {isLoaded && <ReviewContent />}
            {hasError && <ReviewError />}
          </>
        )}
        {/* even if the modal is closed, in case we want to add transitions later */}
        {!(isLoaded || hasError) && <LoadingMessage message={messages.loadingResponse} />}
      </FullscreenModal>
    );
  }
}
ReviewModal.defaultProps = {
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
  hasError: PropTypes.bool.isRequired,
};

export const mapStateToProps = (state) => ({
  isOpen: selectors.app.showReview(state),
  oraName: selectors.app.ora.name(state),
  response: selectors.grading.selected.response(state),
  isLoaded: selectors.requests.fetchSucceeded(state),
  hasError: selectors.requests.showFetchError(state),
});

export const mapDispatchToProps = {
  setShowReview: actions.app.setShowReview,
};

export default connect(mapStateToProps, mapDispatchToProps)(ReviewModal);
