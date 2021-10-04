import React from 'react';
import { shallow } from 'enzyme';

import LinkedLogo from './LinkedLogo';

jest.mock('@edx/frontend-platform', () => ({
  getConfig: () => ({
    LMS_BASE_URL: '<getConfig().LMS_BASE_URL>',
    LOGO_URL: '<getConfig().LOGO_URL>',
    SITE_NAME: '<getConfig().SITE_NAME>',
  }),
}));

describe('Header CourseLabel component', () => {
  test('snapshot', () => {
    expect(
      shallow(<LinkedLogo />),
    ).toMatchSnapshot();
  });
});
