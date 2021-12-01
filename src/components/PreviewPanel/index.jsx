import React from 'react';
import PropTypes from 'prop-types';

import DocViewer, {
  BMPRenderer,
  ImageProxyRenderer,
  JPGRenderer,
  PDFRenderer,
  PNGRenderer,
  TIFFRenderer,
  TXTRenderer,
} from 'react-doc-viewer';

import './PreviewPanel.scss';

/**
 * <PreviewPanel />
 */
const PreviewPanel = ({ uri }) => (
  <DocViewer
    className="preview-panel"
    pluginRenderers={[
      BMPRenderer,
      ImageProxyRenderer,
      JPGRenderer,
      PDFRenderer,
      PNGRenderer,
      TIFFRenderer,
      TXTRenderer,
    ]}
    documents={[{ uri }]}
    config={{
      header: {
        disableHeader: true,
        disableFileName: true,
      },
    }}
  />
);

PreviewPanel.defaultProps = {};
PreviewPanel.propTypes = {
  uri: PropTypes.string.isRequired,
};

export default PreviewPanel;
