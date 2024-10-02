import React from 'react';
import _ from 'lodash';

import { getConfig } from '@edx/frontend-platform';
import { FormattedMessage } from '@edx/frontend-platform/i18n';
import { PageBanner, Hyperlink } from '@openedx/paragon';

import messages from './messages';

export const NotificationsBanner = () => (
  <PageBanner variant="accentB">
    <span>
      <FormattedMessage {...messages.infoMessage} />
      {
        _.isEmpty(getConfig().ACCOUNT_SETTINGS_URL) ? (
          <FormattedMessage {...messages.notificationsBannerLinkMessage} />
        ) : (
          <Hyperlink
            isInline
            variant="muted"
            destination={`${getConfig().ACCOUNT_SETTINGS_URL}/notifications`}
            target="_blank"
            rel="noopener noreferrer"
            showLaunchIcon={false}
          >
            <FormattedMessage {...messages.notificationsBannerLinkMessage} />
          </Hyperlink>
        )
      }
    </span>
  </PageBanner>
);

export default NotificationsBanner;
