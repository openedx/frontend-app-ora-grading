import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';
import { getConfig } from '@edx/frontend-platform';

import { NotificationsBanner } from '.';

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(),
}));

describe('NotificationsBanner component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('snapshots with empty ACCOUNT_SETTINGS_URL', () => {
    getConfig.mockReturnValue({
      ACCOUNT_SETTINGS_URL: '',
    });
    const el = shallow(<NotificationsBanner hide />);
    expect(el.snapshot).toMatchSnapshot();
  });

  test('snapshots with ACCOUNT_SETTINGS_URL', () => {
    getConfig.mockReturnValue({
      ACCOUNT_SETTINGS_URL: 'http://localhost:1997',
    });
    const el = shallow(<NotificationsBanner hide />);
    expect(el.snapshot).toMatchSnapshot();
  });
});
