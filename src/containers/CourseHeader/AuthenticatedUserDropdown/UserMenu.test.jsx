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
jest.mock('@edx/paragon', () => {
  const Dropdown = () => 'Dropdown';
  Dropdown.Toggle = () => 'Dropdown.Toggle';
  Dropdown.Menu = () => 'Dropdown.Menu';
  Dropdown.Item = () => 'Dropdown.Item';
  return { Dropdown };
});
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: () => 'FontAwesomeIcon',
}));
jest.mock('@fortawesome/free-solid-svg-icons', () => ({
  faUserCircle: 'fa-user-circle-icon',
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
