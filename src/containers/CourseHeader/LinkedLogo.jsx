import React from 'react';
import { getConfig } from '@edx/frontend-platform';

const LinkedLogo = () => (
  <a
    className="logo"
    href={`${getConfig().LMS_BASE_URL}/dashboard`}
  >
    <img
      className="d-block"
      src={getConfig().LOGO_URL}
      alt={getConfig().SITE_NAME}
    />
  </a>
);

export default LinkedLogo;
