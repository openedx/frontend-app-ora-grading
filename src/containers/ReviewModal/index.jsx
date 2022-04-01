import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { FullscreenModal } from '@edx/paragon';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import { selectors, thunkActions } from 'data/redux';
import { RequestKeys } from 'data/constants/requests';

import LoadingMessage from 'components/LoadingMessage';
import DemoWarning from 'containers/DemoWarning';
import ReviewActions from 'containers/ReviewActions';
import ReviewContent from './ReviewContent';
import CloseReviewConfirmModal from './components/CloseReviewConfirmModal';
import messages from './messages';

import './ReviewModal.scss';

/**
 * <ReviewModal />
 */
export class ReviewModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = { showConfirmCloseReviewGrade: false };

    this.closeModal = this.closeModal.bind(this);
    this.confirmCloseReviewGrade = this.confirmCloseReviewGrade.bind(this);
    this.onClose = this.onClose.bind(this);
    this.hideConfirmCloseReviewGrade = this.hideConfirmCloseReviewGrade.bind(this);
    this.showConfirmCloseReviewGrade = this.showConfirmCloseReviewGrade.bind(this);
  }

  onClose() {
    if (this.props.hasGradingProgress) {
      this.showConfirmCloseReviewGrade();
    } else {
      this.closeModal();
    }
  }

  get isLoading() {
    return !(this.props.errorStatus || this.props.isLoaded);
  }

  get title() {
    let title = this.props.oraName;
    if (!this.props.isEnabled) {
      title = `${title} - ${this.props.intl.formatMessage(messages.demoTitleMessage)}`;
    }
    return title;
  }

  closeModal() {
    this.props.cancelReview();
  }

  showConfirmCloseReviewGrade() {
    this.setState({ showConfirmCloseReviewGrade: true });
  }

  hideConfirmCloseReviewGrade() {
    this.setState({ showConfirmCloseReviewGrade: false });
  }

  confirmCloseReviewGrade() {
    this.hideConfirmCloseReviewGrade();
    this.closeModal();
  }

  render() {
    const { isOpen, isLoaded, errorStatus } = this.props;
    return (
      <FullscreenModal
        title={this.title}
        isOpen={isOpen}
        beforeBodyNode={(
          <>
            <ReviewActions />
            <DemoWarning />
          </>
        )}
        onClose={this.onClose}
        className="review-modal"
        modalBodyClassName="review-modal-body"
      >
        {isOpen && <ReviewContent />}
        {/* even if the modal is closed, in case we want to add transitions later */}
        {!(isLoaded || errorStatus) && <LoadingMessage message={messages.loadingResponse} />}
        <CloseReviewConfirmModal
          isOpen={this.state.showConfirmCloseReviewGrade}
          onCancel={this.hideConfirmCloseReviewGrade}
          onConfirm={this.confirmCloseReviewGrade}
        />
      </FullscreenModal>
    );
  }
}
ReviewModal.defaultProps = {
  errorStatus: null,
  response: null,
};
ReviewModal.propTypes = {
  // injected
  intl: intlShape.isRequired,
  // redux
  cancelReview: PropTypes.func.isRequired,
  errorStatus: PropTypes.number,
  hasGradingProgress: PropTypes.bool.isRequired,
  isEnabled: PropTypes.bool.isRequired,
  isLoaded: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  oraName: PropTypes.string.isRequired,
  response: PropTypes.shape({
    text: PropTypes.node,
  }),
};

export const mapStateToProps = (state) => ({
  errorStatus: selectors.requests.errorStatus(state, { requestKey: RequestKeys.fetchSubmission }),
  hasGradingProgress: selectors.grading.hasGradingProgress(state),
  isEnabled: selectors.app.isEnabled(state),
  isLoaded: selectors.requests.isCompleted(state, { requestKey: RequestKeys.fetchSubmission }),
  isOpen: selectors.app.showReview(state),
  oraName: selectors.app.ora.name(state),
  response: selectors.grading.selected.response(state),
});

export const mapDispatchToProps = {
  cancelReview: thunkActions.app.cancelReview,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ReviewModal));
