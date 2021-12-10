import React from 'react';
import PropTypes from 'prop-types';

import { Card, Collapsible } from '@edx/paragon';

import './FileCard.scss';

/**
 * <FileCard />
 */
export const FileCard = ({ name, children }) => (
  <Card className="file-card" key={name}>
    <Collapsible className="file-collapsible" defaultOpen title={<h3>{name}</h3>}>
      <div className="preview-panel">
        {children}
      </div>
    </Collapsible>
  </Card>
);
FileCard.defaultProps = {
};
FileCard.propTypes = {
  name: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default FileCard;
