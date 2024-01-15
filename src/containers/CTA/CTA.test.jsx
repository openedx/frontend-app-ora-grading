import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';

import { CTA } from '.';

describe('CTA component', () => {
  test('snapshots', () => {
    const el = shallow(<CTA hide />);
    expect(el.snapshot).toMatchSnapshot();
  });
});
