import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { AppContext } from '@edx/frontend-platform/react';

import AnonymousUserMenu from './AnonymousUserMenu';
import AuthenticatedUserDropdown from './AuthenticatedUserDropdown';
import LinkedLogo from './LinkedLogo';
import CourseLabel from './CourseLabel';

import messages from './messages';

export const Header = ({
  courseOrg,
  courseNumber,
  courseTitle,
  intl,
}) => {
  const { authenticatedUser } = useContext(AppContext);
  return (
    <header className="course-header">
      <a className="sr-only sr-only-focusable" href="#main-content">
        {intl.formatMessage(messages.skipNavLink)}
      </a>
      <div className="container-xl py-2 d-flex align-items-center">
        <LinkedLogo />
        <CourseLabel {...{ courseOrg, courseNumber, courseTitle }} />
        {authenticatedUser
          ? (<AuthenticatedUserDropdown username={authenticatedUser.username} />)
          : (<AnonymousUserMenu />)}
      </div>
    </header>
  );
};
Header.propTypes = {
  courseOrg: PropTypes.string,
  courseNumber: PropTypes.string,
  courseTitle: PropTypes.string,
  intl: intlShape.isRequired,
};
Header.defaultProps = {
  courseOrg: null,
  courseNumber: null,
  courseTitle: null,
};

export default injectIntl(Header);
