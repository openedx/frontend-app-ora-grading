import React from 'react';
import PropTypes from 'prop-types';

import {
  Collapsible,
  Icon,
} from '@openedx/paragon';
import {
  KeyboardArrowDown, KeyboardArrowUp,
} from '@openedx/paragon/icons';

export const ResponseItem = ({ title, response }) => (
  <Collapsible.Advanced className="collapsible-card mb-3">
    <Collapsible.Trigger className="collapsible-trigger d-flex">
      <h4 className="flex-grow-1">{title}</h4>
      <Collapsible.Visible whenClosed><Icon src={KeyboardArrowDown} className="default-bold-color" /></Collapsible.Visible>
      <Collapsible.Visible whenOpen><Icon src={KeyboardArrowUp} className="default-bold-color" /></Collapsible.Visible>
    </Collapsible.Trigger>

    <Collapsible.Body className="collapsible-body pt-3 pb-3">
      {response}
    </Collapsible.Body>
  </Collapsible.Advanced>
);

ResponseItem.propTypes = {
  title: PropTypes.string.isRequired,
  response: PropTypes.string.isRequired,
};

export default ResponseItem;
