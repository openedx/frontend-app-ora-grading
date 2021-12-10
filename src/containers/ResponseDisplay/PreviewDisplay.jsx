import React from 'react';
import PropTypes from 'prop-types';

import { StrictDict } from 'utils';
import { FileTypes } from 'data/constants/files';

import { FileCard, PDFRenderer, ImageRenderer } from 'components/FilePreview';

import './PreviewDisplay.scss';

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
      <>
        {this.supportedFiles.map(({ name, downloadUrl }) => {
          const Renderer = PreviewDisplay.RENDERERS[this.fileType(name)];
          return (
            <FileCard key={downloadUrl} name={name}>
              <Renderer fileName={name} url={downloadUrl} />
            </FileCard>
          );
        })}
      </>
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
