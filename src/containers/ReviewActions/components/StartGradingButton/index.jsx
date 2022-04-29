import React from 'react';
import { useDispatch } from 'react-redux';

import { Button } from '@edx/paragon';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import StopGradingConfirmModal from '../StopGradingConfirmModal';
import OverrideGradeConfirmModal from '../OverrideGradeConfirmModal';

import * as hooks from './hooks';

export const StartGradingButton = ({ intl }) => {
  const dispatch = useDispatch();
  const {
    hide,
    buttonArgs,
    overrideGradeArgs,
    stopGradingArgs,
  } = hooks.buttonHooks({ dispatch, intl });

  if (hide) {
    return null;
  }

  return (
    <>
      <Button variant="primary" {...buttonArgs} />
      <OverrideGradeConfirmModal {...overrideGradeArgs} />
      <StopGradingConfirmModal {...stopGradingArgs} />
    </>
  );
};

StartGradingButton.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(StartGradingButton);
