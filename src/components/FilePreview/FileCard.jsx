import React from 'react';
import PropTypes from 'prop-types';

import { Card, Collapsible } from '@edx/paragon';
import FilePopoverContent from 'components/FilePopoverContent';
import FileInfo from './FileInfo';

import './FileCard.scss';

/**
 * <FileCard />
 */
export const FileCard = ({ file, children }) => (
  <Card className="file-card" key={file.name}>
    <Collapsible
      className="file-collapsible"
      defaultOpen
      title={<h3 className="file-card-title">{file.name}</h3>}
    >
      <div className="preview-panel">
        <FileInfo><FilePopoverContent {...file} /></FileInfo>
        {children}
      </div>
    </Collapsible>
  </Card>
);
FileCard.defaultProps = {
};
FileCard.propTypes = {
  file: PropTypes.shape({
    name: PropTypes.string.isRequired,
    downloadUrl: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  children: PropTypes.node.isRequired,
};

export default FileCard;
