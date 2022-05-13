import React from 'react';

import { FormattedMessage } from '@edx/frontend-platform/i18n';
import { PageBanner } from '@edx/paragon';

import messages from './messages';

/**
 * <CTA />
 */
export const CTA = () => (
  <PageBanner variant="light">
    <span>
      <FormattedMessage {...messages.ctaFeedbackMessage} />&nbsp;
      <a
        href="https://docs.google.com/forms/d/1Hu1rgJcCHl5_EtDb5Up3hiZ40sSUtkZQfRHJ3fWOvfQ/edit"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FormattedMessage {...messages.ctaLinkMessage} />
      </a>
      .
    </span>
  </PageBanner>
);

export default CTA;
