import React from 'react';
import { useDispatch } from 'react-redux';

import { Button } from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import StopGradingConfirmModal from '../StopGradingConfirmModal';
import OverrideGradeConfirmModal from '../OverrideGradeConfirmModal';

import * as hooks from './hooks';

export const StartGradingButton = () => {
  const intl = useIntl();
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

export default StartGradingButton;
