import React from 'react';
import { shallow } from 'enzyme';

import AssessmentsTable from '.';

describe('AssessmentsTable component', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<AssessmentsTable />);
    expect(wrapper.exists()).toBe(true);
  });
});
