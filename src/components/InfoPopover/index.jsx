import React from 'react';
import PropTypes from 'prop-types';

import {
  OverlayTrigger,
  Popover,
  Icon,
  IconButton,
  PopoverContent,
} from '@edx/paragon';
import { InfoOutline } from '@edx/paragon/icons';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import messages from './messages';

/**
 * <InfoPopover />
 */
export const InfoPopover = ({ children, intl }) => (
  <OverlayTrigger
    trigger="focus"
    placement="auto"
    flip
    overlay={(
      <Popover className="overlay-help-popover">
        <PopoverContent>{children}</PopoverContent>
      </Popover>
    )}
  >
    <IconButton
      className="esg-help-icon"
      src={InfoOutline}
      alt={intl.formatMessage(messages.altText)}
      iconAs={Icon}
      onClick={() => {}}
    />
  </OverlayTrigger>
);

InfoPopover.defaultProps = {};
InfoPopover.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  intl: intlShape.isRequired,
};

export default injectIntl(InfoPopover);
