import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from '@edx/frontend-platform/i18n';

import messages from './messages';

export const FilePopoverContent = ({ file }) => (
  <>
    <div className="help-popover-option">
      <strong><FormattedMessage {...messages.filePopoverNameTitle} /></strong>
      <br />
      {file.name}
    </div>
    <div className="help-popover-option">
      <strong><FormattedMessage {...messages.filePopoverDescriptionTitle} /></strong>
      <br />
      {file.description}
    </div>
  </>
);

FilePopoverContent.defaultProps = {
};

FilePopoverContent.propTypes = {
  file: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    downloadURL: PropTypes.string,
  }).isRequired,
};

export default FilePopoverContent;
