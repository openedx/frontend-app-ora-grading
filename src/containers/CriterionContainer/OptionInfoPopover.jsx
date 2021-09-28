import React from 'react';
import PropTypes from 'prop-types';

import {
  OverlayTrigger,
  Popover,
  Icon,
  IconButton,
} from '@edx/paragon';
import { InfoOutline } from '@edx/paragon/icons';

/**
 * <OptionInfoPopover />
 */
export const OptionInfoPopover = ({ options }) => (
  <OverlayTrigger
    trigger="focus"
    placement="left"
    overlay={(
      <Popover className="overlay-help-popover">
        <Popover.Content>
          {options.map(option => (
            <div key={option.name} className="help-popover-option">
              <strong>{option.label}</strong><br />
              {option.explanation}
            </div>
          ))}
        </Popover.Content>
      </Popover>
    )}
  >
    <IconButton
      className="criteria-help-icon"
      onClick={() => {}}
      src={InfoOutline}
      alt="criterion info"
      iconAs={Icon}
    />
  </OverlayTrigger>
);

OptionInfoPopover.defaultProps = {
};

OptionInfoPopover.propTypes = {
  // redux
  options: PropTypes.arrayOf(PropTypes.shape({
    explanation: PropTypes.string,
    label: PropTypes.string,
    name: PropTypes.string,
    points: PropTypes.number,
  })).isRequired,
};

export default OptionInfoPopover;
