import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';

import LoadingBanner from './LoadingBanner';

describe('Loading Banner component', () => {
  test('snapshot', () => {
    const el = shallow(<LoadingBanner />);
    expect(el.snapshot).toMatchSnapshot();
  });
});
