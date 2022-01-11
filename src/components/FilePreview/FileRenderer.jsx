import React from 'react';
import PropTypes from 'prop-types';

import { StrictDict } from 'utils';
import { FileTypes } from 'data/constants/files';
import { FormattedMessage } from '@edx/frontend-platform/i18n';

import {
  PDFRenderer,
  ImageRenderer,
  TXTRenderer,
} from 'components/FilePreview/BaseRenderers';
import FileCard from './FileCard';

import { ErrorBanner, LoadingBanner } from './Banners';

import messages from './messages';

export const RENDERERS = StrictDict({
  [FileTypes.pdf]: PDFRenderer,
  [FileTypes.jpg]: ImageRenderer,
  [FileTypes.jpeg]: ImageRenderer,
  [FileTypes.bmp]: ImageRenderer,
  [FileTypes.png]: ImageRenderer,
  [FileTypes.txt]: TXTRenderer,
});

export const ERROR_STATUSES = {
  404: {
    headingMessage: messages.fileNotFoundError,
    children: <FormattedMessage {...messages.fileNotFoundError} />,
  },
  500: {
    headingMessage: messages.unknownError,
    children: <FormattedMessage {...messages.unknownError} />,
  },
};

export const SUPPORTED_TYPES = Object.keys(RENDERERS);

export const getFileType = (fileName) => fileName.split('.').pop()?.toLowerCase();
export const isSupported = (file) => SUPPORTED_TYPES.includes(getFileType(file.name));

/**
 * <FileRenderer />
 */
export class FileRenderer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errorStatus: null,
      isLoading: true,
    };

    this.onError = this.onError.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.resetState = this.resetState.bind(this);
  }

  onError(status) {
    this.setState({
      errorStatus: status,
      isLoading: false,
    });
  }

  onSuccess() {
    this.setState({
      errorStatus: null,
      isLoading: false,
    });
  }

  get getError() {
    const status = this.state.errorStatus;
    return {
      ...ERROR_STATUSES[status] || ERROR_STATUSES[500],
      actions: [
        {
          id: 'retry',
          onClick: this.resetState,
          message: messages.retryButton,
        },
      ],
    };
  }

  resetState = () => {
    this.setState({
      errorStatus: null,
      isLoading: true,
    });
  };

  render() {
    const { file } = this.props;
    const Renderer = RENDERERS[getFileType(file.name)];
    return (
      <FileCard key={file.downloadUrl} file={file}>
        {this.state.isLoading && <LoadingBanner />}
        {this.state.errorStatus ? (
          <ErrorBanner {...this.getError} />
        ) : (
          <Renderer
            fileName={file.name}
            url={file.downloadUrl}
            onError={this.onError}
            onSuccess={this.onSuccess}
          />
        )}
      </FileCard>
    );
  }
}

FileRenderer.defaultProps = {};
FileRenderer.propTypes = {
  file: PropTypes.shape({
    name: PropTypes.string,
    downloadUrl: PropTypes.string,
  }).isRequired,
};

export default FileRenderer;
