import React from 'react';
import { shallow } from 'enzyme';

import { AnonymousUserMenu } from './AnonymousUserMenu';

jest.mock('@edx/frontend-platform', () => ({
  getConfig: () => ({
    LMS_BASE_URL: '<LMS_BASE_URL>',
  }),
}));
jest.mock('@edx/frontend-platform/auth', () => ({
  getLoginRedirectUrl: (url) => `redirect:${url}`,
}));

describe('Header AnonymousUserMenu component', () => {
  const props = {
    intl: { formatMessage: (msg) => msg.defaultMessage },
  };
  test('snapshot', () => {
    expect(
      shallow(<AnonymousUserMenu {...props} />),
    ).toMatchSnapshot();
  });
});
