import React from 'react';
import PropTypes from 'prop-types';

import './PreviewPanel.scss';
import PDFRenderer from './PDFRenderer';
import ImageRenderer from './ImageRenderer';

const DefaultRenderer = () => <div>Unsupported files</div>;

const defaultPlugins = [PDFRenderer, ImageRenderer];

/**
 * <PreviewPanel />
 */
export class PreviewPanel extends React.Component {
  static renderers = defaultPlugins.reduce(
    (accumulate, component) => ({
      ...accumulate,
      ...component.supportedTypes.reduce(
        (result, type) => ({ ...result, [type]: component }),
        {},
      ),
    }),
    { default: DefaultRenderer },
  );

  static supportedTypes = Object.keys(PreviewPanel.renderers);

  static isSupported = (fileName) => {
    const fileType = fileName.split('.').pop();
    return PreviewPanel.supportedTypes.includes(fileType);
  };

  get fileType() {
    if (this.props.fileName) {
      return this.props.fileName.split('.').pop();
    }
    return 'default';
  }

  render() {
    const Renderer = PreviewPanel.renderers[this.fileType];
    return (
      <div className="preview-panel">
        <Renderer {...this.props} />
      </div>
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