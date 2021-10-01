import React from 'react';
import PropTypes from 'prop-types';

import { getConfig } from '@edx/frontend-platform';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Dropdown } from '@edx/paragon';

import messages from '../messages';

export class UserMenu extends React.Component {
  menuItem(href, message) {
    return (
      <Dropdown.Item href={href}>
        {this.props.intl.formatMessage(message)}
      </Dropdown.Item>
    );
  }

  render() {
    const { username } = this.props;
    const { LMS_BASE_URL, LOGOUT_URL } = getConfig();
    return (
      <Dropdown.Menu className="dropdown-menu-right">
        {this.menuItem(`${LMS_BASE_URL}/dashboard`, messages.dashboard)}
        {this.menuItem(`${LMS_BASE_URL}/u/${username}`, messages.profile)}
        {this.menuItem(`${LMS_BASE_URL}/account/settings`, messages.account)}
        {this.menuItem(LOGOUT_URL, messages.signOut)}
      </Dropdown.Menu>
    );
  }
}

UserMenu.propTypes = {
  intl: intlShape.isRequired,
  username: PropTypes.string.isRequired,
};

UserMenu.defaultProps = {};

export default injectIntl(UserMenu);
