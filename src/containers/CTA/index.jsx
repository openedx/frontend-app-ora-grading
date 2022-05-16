import React from 'react';

import { FormattedMessage } from '@edx/frontend-platform/i18n';
import { PageBanner, Hyperlink } from '@edx/paragon';

import messages from './messages';

/**
 * <CTA />
 */
export const CTA = () => (
  <PageBanner>
    <span>
      <FormattedMessage {...messages.ctaFeedbackMessage} />&nbsp;
      <Hyperlink
        isInline
        variant="muted"
        destination="https://docs.google.com/forms/d/1Hu1rgJcCHl5_EtDb5Up3hiZ40sSUtkZQfRHJ3fWOvfQ/edit"
        target="_blank"
        showLaunchIcon={false}
      >
        <FormattedMessage {...messages.ctaLinkMessage} />
      </Hyperlink>
      .
    </span>
  </PageBanner>
);

export default CTA;
