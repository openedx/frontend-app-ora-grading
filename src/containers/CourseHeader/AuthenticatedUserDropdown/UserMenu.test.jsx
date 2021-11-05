import React from 'react';
import { shallow } from 'enzyme';

import { UserMenu } from './UserMenu';

jest.mock('@edx/frontend-platform', () => ({
  getConfig: () => ({
    LMS_BASE_URL: '<LMS_BASE_URL>',
    LOGOUT_URL: '<LOGOUT_URL>',
    SUPPORT_URL: '<SUPPORT_URL>',
  }),
}));

describe('Header AuthenticatedUserDropdown UserMenu component', () => {
  const props = {
    intl: { formatMessage: (msg) => msg.defaultMessage },
    username: 'test-username',
  };
  test('snapshot', () => {
    expect(
      shallow(<UserMenu {...props} />),
    ).toMatchSnapshot();
  });
});
