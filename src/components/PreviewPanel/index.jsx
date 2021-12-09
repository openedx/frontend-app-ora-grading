import React from 'react';
import PropTypes from 'prop-types';

import { Card, Collapsible } from '@edx/paragon';
import { StrictDict } from 'utils';
import { fileTypes } from 'data/constants/files';

import PDFRenderer from './PDFRenderer';
import ImageRenderer from './ImageRenderer';

import './PreviewPanel.scss';

/**
 * <PreviewPanel />
 */
export class PreviewPanel extends React.Component {
  static renderers = StrictDict({
    [fileTypes.pdf]: PDFRenderer,
    [fileTypes.jpg]: ImageRenderer,
    [fileTypes.jpeg]: ImageRenderer,
    [fileTypes.bmp]: ImageRenderer,
    [fileTypes.png]: ImageRenderer,
  });

  static supportedTypes = Object.keys(PreviewPanel.renderers);

  get isSupported() {
    return PreviewPanel.supportedTypes.includes(this.fileType);
  }

  get fileType() {
    return this.props.fileName.split('.').pop();
  }

  render() {
    if (!this.isSupported) {
      return null;
    }
    const Renderer = PreviewPanel.renderers[this.fileType];
    return (
      <Card className="submission-files" key={this.props.fileName}>
        <Collapsible defaultOpen title={<h3>{this.props.fileName}</h3>}>
          <div className="preview-panel">
            <Renderer {...this.props} />
          </div>
        </Collapsible>
      </Card>
    );
  }
}

PreviewPanel.defaultProps = {
  fileName: undefined,
};
PreviewPanel.propTypes = {
  url: PropTypes.string.isRequired,
  fileName: PropTypes.string,
};

export default PreviewPanel;
