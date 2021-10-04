import React from 'react';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

import { Dropdown } from '@edx/paragon';

export const UserAvatar = ({ username }) => (
  <Dropdown.Toggle variant="outline-primary">
    <FontAwesomeIcon
      icon={faUserCircle}
      className="d-md-none"
      size="lg"
    />
    <span data-hj-suppress className="d-none d-md-inline">
      {username}
    </span>
  </Dropdown.Toggle>
);
UserAvatar.propTypes = {
  username: PropTypes.string.isRequired,
};

UserAvatar.defaultProps = {};

export default UserAvatar;
