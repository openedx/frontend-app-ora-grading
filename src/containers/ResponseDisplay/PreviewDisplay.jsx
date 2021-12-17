import React from 'react';
import PropTypes from 'prop-types';

import { StrictDict } from 'utils';
import { FileTypes } from 'data/constants/files';

import {
  FileCard, PDFRenderer, ImageRenderer, TXTRenderer,
} from 'components/FilePreview';

/**
 * <PreviewDisplay />
 */
export class PreviewDisplay extends React.Component {
  static RENDERERS = StrictDict({
    [FileTypes.pdf]: PDFRenderer,
    [FileTypes.jpg]: ImageRenderer,
    [FileTypes.jpeg]: ImageRenderer,
    [FileTypes.bmp]: ImageRenderer,
    [FileTypes.png]: ImageRenderer,
    [FileTypes.txt]: TXTRenderer,
  });

  static SUPPORTED_TYPES = Object.keys(PreviewDisplay.RENDERERS);

  constructor(props) {
    super(props);
    this.isSupported = this.isSupported.bind(this);
    this.fileType = this.fileType.bind(this);
  }

  get supportedFiles() {
    return this.props.files.filter(this.isSupported);
  }

  isSupported(file) {
    return PreviewDisplay.SUPPORTED_TYPES.includes(this.fileType(file.name));
  }

  fileType(fileName) {
    return fileName.split('.').pop();
  }

  render() {
    return (
      <div className="preview-display">
        {this.supportedFiles.map((file) => {
          const Renderer = PreviewDisplay.RENDERERS[this.fileType(file.name)];
          return (
            <FileCard key={file.downloadUrl} file={file}>
              <Renderer fileName={file.name} url={file.downloadUrl} />
            </FileCard>
          );
        })}
      </div>
    );
  }
}

PreviewDisplay.defaultProps = {
  files: [],
};
PreviewDisplay.propTypes = {
  files: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    downloadUrl: PropTypes.string,
  })),
};

export default PreviewDisplay;
