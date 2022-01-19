import React from 'react';
import { shallow } from 'enzyme';

import LoadingBanner from './LoadingBanner';

describe('Loading Banner component', () => {
  test('snapshot', () => {
    const el = shallow(<LoadingBanner />);
    expect(el).toMatchSnapshot();
  });
});
