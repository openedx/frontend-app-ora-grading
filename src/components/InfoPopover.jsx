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

/**
 * <InfoPopover />
 */
export const InfoPopover = ({ children }) => (
  <OverlayTrigger
    trigger="focus"
    placement="auto"
    flip
    overlay={
      <Popover className="overlay-help-popover">
        <PopoverContent>{children}</PopoverContent>
      </Popover>
    }
  >
    <IconButton
      className="criteria-help-icon"
      src={InfoOutline}
      alt="criterion info"
      iconAs={Icon}
    />
  </OverlayTrigger>
);

InfoPopover.defaultProps = {};

InfoPopover.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default InfoPopover;
