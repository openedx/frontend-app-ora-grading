import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';

import { NotificationsBanner } from '.';

describe('NotificationsBanner component', () => {
  test('snapshots', () => {
    const el = shallow(<NotificationsBanner hide />);
    expect(el.snapshot).toMatchSnapshot();
  });
});
