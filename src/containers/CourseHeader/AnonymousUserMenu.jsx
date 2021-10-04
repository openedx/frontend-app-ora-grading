import React from 'react';

import { getConfig } from '@edx/frontend-platform';
import { getLoginRedirectUrl } from '@edx/frontend-platform/auth';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Button } from '@edx/paragon';

import message from './messages';

export const getRegisterUrl = () => {
  const { LMS_BASE_URL } = getConfig();
  const locationHref = encodeURIComponent(global.location.href);
  return `${LMS_BASE_URL}/register?next=${locationHref}`;
};

export const AnonymousUserMenu = ({ intl }) => (
  <div>
    <Button
      className="mr-3"
      variant="outline-primary"
      href={getRegisterUrl()}
    >
      {intl.formatMessage(message.registerSentenceCase)}
    </Button>
    <Button
      variant="primary"
      href={`${getLoginRedirectUrl(global.location.href)}`}
    >
      {intl.formatMessage(message.signInSentenceCase)}
    </Button>
  </div>
);

AnonymousUserMenu.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(AnonymousUserMenu);
