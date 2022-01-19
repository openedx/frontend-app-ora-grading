import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from '@edx/frontend-platform/i18n';
import filesize from 'filesize';

import messages from './messages';

export const FilePopoverContent = ({ name, description, size }) => (
  <>
    <div className="help-popover-option">
      <strong><FormattedMessage {...messages.filePopoverNameTitle} /></strong>
      <br />
      {name}
    </div>
    <div className="help-popover-option">
      <strong><FormattedMessage {...messages.filePopoverDescriptionTitle} /></strong>
      <br />
      {description}
    </div>
    <div className="help-popover-option">
      <strong><FormattedMessage {...messages.fileSizeTitle} /></strong>
      <br />
      {typeof (size) === 'number' ? filesize(size) : 'Unknown'}
    </div>
  </>
);

FilePopoverContent.defaultProps = {
  description: '',
  size: null,
};

FilePopoverContent.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  size: PropTypes.number,
};

export default FilePopoverContent;
