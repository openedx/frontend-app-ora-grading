import React from 'react';
import { shallow } from 'enzyme';

import { CTA } from '.';

describe('CTA component', () => {
  test('snapshots', () => {
    const el = shallow(<CTA hide />);
    expect(el).toMatchSnapshot();
  });
});
