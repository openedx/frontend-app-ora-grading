import React from 'react';
import { useDispatch } from 'react-redux';

import { FullscreenModal } from '@openedx/paragon';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import LoadingMessage from 'components/LoadingMessage';
import DemoWarning from 'containers/DemoWarning';
import ReviewProblemStepsContent from './components/ReviewProblemStepsContent';
import ReviewProblemStepActions from './components/ReviewProblemStepActions';
import CloseReviewConfirmModal from './components/CloseReviewConfirmModal';
import messages from './messages';
import * as hooks from './hooks';
import './ReviewProblemStepsModal.scss';
import { transformObjectToDetail } from './utils';

export const ReviewProblemStepsModal = () => {
  const dispatch = useDispatch();
  const {
    isLoading,
    onClose,
    isModalOpen,
    closeConfirmModalProps,
    errorStatus,
    submissions,
    currentSubmission,
  } = hooks.rendererHooks({ dispatch });

  const { submissionUUID, response } = currentSubmission;
  const submissionData = submissions[submissionUUID] || {};
  const stepProblemDetail = submissions[submissionUUID] ? transformObjectToDetail(submissionData) : {};
  const hasDetailSubmissionError = typeof errorStatus !== 'undefined';

  return (
    <FullscreenModal
      title="Staff - Grading Demo"
      isOpen={isModalOpen}
      beforeBodyNode={(
        <>
          { submissionData && <ReviewProblemStepActions {...stepProblemDetail} /> }
          <DemoWarning />
        </>
      )}
      onClose={onClose}
      className="review-modal"
      modalBodyClassName="review-step-problems-modal-body"
    >
      {isModalOpen && submissionUUID && (
      <ReviewProblemStepsContent
        submissionUUID={submissionUUID}
        hasDetailSubmissionError={hasDetailSubmissionError}
        responses={response}
        data-testid="review-step-problems-content"
      />
      )}
      {/* even if the modal is closed, in case we want to add transitions later */}
      {isLoading && <LoadingMessage message={messages.loadingResponse} data-testid="loading-message" />}
      <CloseReviewConfirmModal {...closeConfirmModalProps} data-testid="close-review-modal" />
    </FullscreenModal>
  );
};
ReviewProblemStepsModal.propTypes = {
  // injected
  intl: intlShape.isRequired,
};

export default injectIntl(ReviewProblemStepsModal);
