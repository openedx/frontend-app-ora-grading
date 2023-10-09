import React from 'react';
import { useDispatch } from 'react-redux';

import { FullscreenModal } from '@edx/paragon';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import LoadingMessage from 'components/LoadingMessage';
import DemoWarning from 'containers/DemoWarning';
import ReviewProblemStepsContent from './components/ReviewProblemStepsContent';
import ReviewProblemStepActions from './components/ReviewProblemStepActions';
import CloseReviewConfirmModal from './components/CloseReviewConfirmModal';
import messages from './messages';
import * as hooks from './hooks';
import './ReviewProblemStepsModal.scss';

/**
 * <ReviewProblemStepsModal />
 */
export const ReviewProblemStepsModal = () => {
  const dispatch = useDispatch();
  const {
    isLoading,
    onClose,
    isModalOpen,
    closeConfirmModalProps,
  } = hooks.rendererHooks({ dispatch });

  return (
    <FullscreenModal
      title="Staff - Grading Demo"
      isOpen={isModalOpen}
      beforeBodyNode={(
        <>
          <ReviewProblemStepActions />
          <DemoWarning />
        </>
      )}
      onClose={onClose}
      className="review-modal"
      modalBodyClassName="review-step-problems-modal-body"
    >
      {isModalOpen && <ReviewProblemStepsContent />}
      {/* even if the modal is closed, in case we want to add transitions later */}
      {isLoading && <LoadingMessage message={messages.loadingResponse} />}
      <CloseReviewConfirmModal {...closeConfirmModalProps} />
    </FullscreenModal>
  );
};
ReviewProblemStepsModal.propTypes = {
  // injected
  intl: intlShape.isRequired,
};

export default injectIntl(ReviewProblemStepsModal);
