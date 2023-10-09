import React from 'react';
import { shallow } from 'enzyme';
import ResponsesList from '.';

describe('ResponsesList component', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<ResponsesList />);
    expect(wrapper.exists()).toBe(true);
  });
});
