import React from 'react';
import PropTypes from 'prop-types';

import { getConfig } from '@edx/frontend-platform';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Dropdown } from '@edx/paragon';

import UserMenu from './UserMenu';
import UserAvatar from './UserAvatar';

import messages from '../messages';

export const AuthenticatedUserDropdown = ({
  intl,
  username,
}) => (
  <>
    <a className="text-gray-700 mr-3" href={`${getConfig().SUPPORT_URL}`}>
      {intl.formatMessage(messages.help)}
    </a>
    <Dropdown className="user-dropdown">
      <UserAvatar username={username} />
      <UserMenu username={username} />
    </Dropdown>
  </>
);

AuthenticatedUserDropdown.propTypes = {
  intl: intlShape.isRequired,
  username: PropTypes.string.isRequired,
};

AuthenticatedUserDropdown.defaultProps = {};

export default injectIntl(AuthenticatedUserDropdown);
