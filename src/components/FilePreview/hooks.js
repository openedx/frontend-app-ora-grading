import React from 'react';

import { StrictDict } from 'utils';
import { ErrorStatuses } from 'data/constants/requests';
import { FileTypes } from 'data/constants/files';

import {
  PDFRenderer,
  ImageRenderer,
  TXTRenderer,
} from 'components/FilePreview/BaseRenderers';

import * as module from './hooks';
import messages from './messages';

/**
 * Config data
 */
export const RENDERERS = StrictDict({
  [FileTypes.pdf]: PDFRenderer,
  [FileTypes.jpg]: ImageRenderer,
  [FileTypes.jpeg]: ImageRenderer,
  [FileTypes.bmp]: ImageRenderer,
  [FileTypes.png]: ImageRenderer,
  [FileTypes.txt]: TXTRenderer,
  [FileTypes.gif]: ImageRenderer,
  [FileTypes.jfif]: ImageRenderer,
  [FileTypes.pjpeg]: ImageRenderer,
  [FileTypes.pjp]: ImageRenderer,
  [FileTypes.svg]: ImageRenderer,
});

export const SUPPORTED_TYPES = Object.keys(RENDERERS);

export const ERROR_STATUSES = {
  [ErrorStatuses.notFound]: messages.fileNotFoundError,
  [ErrorStatuses.serverError]: messages.unknownError,
};

/**
 * State hooks
 */
export const state = StrictDict({
  errorStatus: (val) => React.useState(val),
  isLoading: (val) => React.useState(val),
});

/**
 * Util methods and transforms
 */
export const getFileType = (fileName) => fileName.split('.').pop()?.toLowerCase();
export const isSupported = (file) => module.SUPPORTED_TYPES.includes(
  module.getFileType(file.name),
);

/**
 * component hooks
 */
export const renderHooks = ({
  file,
  intl,
}) => {
  const [errorStatus, setErrorStatus] = module.state.errorStatus(null);
  const [isLoading, setIsLoading] = module.state.isLoading(true);

  const setState = (newState) => {
    setErrorStatus(newState.errorStatus);
    setIsLoading(newState.isLoading);
  };

  const stopLoading = (status = null) => setState({ isLoading: false, errorStatus: status });

  const errorMessage = (
    module.ERROR_STATUSES[errorStatus] || module.ERROR_STATUSES[ErrorStatuses.serverError]
  );
  const errorAction = {
    id: 'retry',
    onClick: () => setState({ errorStatus: null, isLoading: true }),
    message: messages.retryButton,
  };
  const error = {
    headerMessage: errorMessage,
    children: intl.formatMessage(errorMessage),
    actions: [errorAction],
  };

  const Renderer = module.RENDERERS[module.getFileType(file.name)];
  const rendererProps = {
    fileName: file.name,
    url: file.downloadUrl,
    onError: stopLoading,
    onSuccess: () => stopLoading(),
  };

  return {
    errorStatus,
    isLoading,
    error,
    Renderer,
    rendererProps,
  };
};
