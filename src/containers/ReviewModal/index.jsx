import React from 'react';
import { useDispatch } from 'react-redux';

import { FullscreenModal } from '@edx/paragon';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import LoadingMessage from 'components/LoadingMessage';
import DemoWarning from 'containers/DemoWarning';
import ReviewActions from 'containers/ReviewActions';
import ReviewContent from './ReviewContent';
import CloseReviewConfirmModal from './components/CloseReviewConfirmModal';
import messages from './messages';

import * as hooks from './hooks';

import './ReviewModal.scss';

/**
 * <ReviewModal />
 */
export const ReviewModal = ({ intl }) => {
  const dispatch = useDispatch();
  const {
    isLoading,
    title,
    onClose,
    isOpen,
    closeConfirmModalProps,
  } = hooks.rendererHooks({ dispatch, intl });
  return (
    <FullscreenModal
      title={title}
      isOpen={isOpen}
      beforeBodyNode={(
        <>
          <ReviewActions />
          <DemoWarning />
        </>
      )}
      onClose={onClose}
      className="review-modal"
      modalBodyClassName="review-modal-body"
    >
      {isOpen && <ReviewContent />}
      {/* even if the modal is closed, in case we want to add transitions later */}
      {isLoading && <LoadingMessage message={messages.loadingResponse} />}
      <CloseReviewConfirmModal {...closeConfirmModalProps} />
    </FullscreenModal>
  );
};
ReviewModal.propTypes = {
  // injected
  intl: intlShape.isRequired,
};

export default injectIntl(ReviewModal);
