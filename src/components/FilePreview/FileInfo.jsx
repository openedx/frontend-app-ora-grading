import React from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  OverlayTrigger,
  Popover,
} from '@openedx/paragon';
import { InfoOutline } from '@openedx/paragon/icons';
import { FormattedMessage } from '@edx/frontend-platform/i18n';
import { nullMethod } from '@src/hooks';
import messages from './messages';

/**
 * <FileInfo />
 */
export const FileInfo = ({ onClick, children }) => (
  <OverlayTrigger
    trigger="focus"
    placement="right-end"
    flip
    overlay={(
      <Popover id="file-popover" className="overlay-help-popover">
        <Popover.Content>{children}</Popover.Content>
      </Popover>
    )}
  >
    <Button
      size="sm"
      variant="tertiary"
      onClick={onClick}
      iconAfter={InfoOutline}
    >
      <FormattedMessage {...messages.fileInfo} />
    </Button>
  </OverlayTrigger>
);

FileInfo.defaultProps = {
  onClick: nullMethod,
};
FileInfo.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default FileInfo;
