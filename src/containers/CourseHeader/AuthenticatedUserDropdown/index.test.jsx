import React from 'react';
import { shallow } from 'enzyme';

import { AuthenticatedUserDropdown } from '.';

jest.mock('@edx/frontend-platform', () => ({
  getConfig: () => ({
    SUPPORT_URL: '<SUPPORT_URL>',
  }),
}));
jest.mock('./UserAvatar', () => 'UserAvatar');
jest.mock('./UserMenu', () => 'UserMenu');

describe('Header AuthenticatedUserDropdown component', () => {
  const props = {
    intl: { formatMessage: (msg) => msg.defaultMessage },
    username: 'test-username',
  };
  test('snapshot', () => {
    expect(
      shallow(<AuthenticatedUserDropdown {...props} />),
    ).toMatchSnapshot();
  });
});
