import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { FullscreenModal } from '@edx/paragon';

import { selectors, actions, thunkActions } from 'data/redux';
import { RequestKeys } from 'data/constants/requests';
import { gradingStatuses as statuses } from 'data/services/lms/constants';

import LoadingMessage from 'components/LoadingMessage';
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

    this.onClose = this.onClose.bind(this);

    this.closeModal = this.closeModal.bind(this);
    this.showConfirmCloseReviewGrade = this.showConfirmCloseReviewGrade.bind(this);
    this.hideConfirmCloseReviewGrade = this.hideConfirmCloseReviewGrade.bind(this);
    this.confirmCloseReviewGrade = this.confirmCloseReviewGrade.bind(this);
  }

  onClose() {
    if (this.props.gradingStatus === statuses.inProgress) {
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
    if (process.env.REACT_APP_NOT_ENABLED) {
      title = `${title} - Grading Demo`;
    }
    return title;
  }

  closeModal() {
    this.props.setShowReview(false);
    this.props.reloadSubmissions();
  }

  showConfirmCloseReviewGrade() {
    this.setState({ showConfirmCloseReviewGrade: true });
  }

  hideConfirmCloseReviewGrade() {
    this.setState({ showConfirmCloseReviewGrade: false });
  }

  confirmCloseReviewGrade() {
    this.hideConfirmCloseReviewGrade();
    this.props.stopGrading();
    this.closeModal();
  }

  render() {
    const { isOpen, isLoaded, errorStatus } = this.props;
    return (
      <FullscreenModal
        title={this.title}
        isOpen={isOpen}
        beforeBodyNode={<ReviewActions />}
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
  gradingStatus: null,
};
ReviewModal.propTypes = {
  oraName: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  response: PropTypes.shape({
    text: PropTypes.node,
  }),
  isLoaded: PropTypes.bool.isRequired,
  errorStatus: PropTypes.number,
  gradingStatus: PropTypes.string,
  setShowReview: PropTypes.func.isRequired,
  stopGrading: PropTypes.func.isRequired,
  reloadSubmissions: PropTypes.func.isRequired,
};

export const mapStateToProps = (state) => ({
  isOpen: selectors.app.showReview(state),
  oraName: selectors.app.ora.name(state),
  response: selectors.grading.selected.response(state),
  isLoaded: selectors.requests.isCompleted(state, { requestKey: RequestKeys.fetchSubmission }),
  errorStatus: selectors.requests.errorStatus(state, { requestKey: RequestKeys.fetchSubmission }),
  gradingStatus: selectors.grading.selected.gradingStatus(state),
});

export const mapDispatchToProps = {
  setShowReview: actions.app.setShowReview,
  stopGrading: thunkActions.grading.cancelGrading,
  reloadSubmissions: thunkActions.app.initialize,
};

export default connect(mapStateToProps, mapDispatchToProps)(ReviewModal);
