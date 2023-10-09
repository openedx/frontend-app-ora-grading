import React from 'react';
import { shallow } from 'enzyme';
import ReviewProblemStepActions from '.';

describe('ReviewProblemStepActions component', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<ReviewProblemStepActions />);
    expect(wrapper.exists()).toBe(true);
  });
  it('should render the component with correct content', () => {
    const wrapper = shallow(<ReviewProblemStepActions />);

    // Check if certain elements with expected text content exist in the rendered component
    expect(wrapper.find('h3').text()).toEqual('John Doe');
    expect(wrapper.find('p').at(0).text()).toEqual('jhon_20');
    expect(wrapper.find('h4').at(0).text()).toEqual('Email');
    expect(wrapper.find('p').at(1).text()).toEqual('jhonvente@email.com');
    expect(wrapper.find('h4').at(1).text()).toEqual('Submission ID');
    expect(wrapper.find('p').at(2).text()).toEqual('483234704918');
    expect(wrapper.find('h4').at(2).text()).toEqual('Submission date');
    expect(wrapper.find('p').at(3).text()).toEqual('9/13/2023, 7:13:56 AM');
    expect(wrapper.find('h4').at(3).text()).toEqual('Grade');
    expect(wrapper.find('p').at(4).text()).toEqual('3/10');
    expect(wrapper.find('h4').at(4).text()).toEqual('Grading status');
    expect(wrapper.find('p').at(5).text()).toEqual('Upgraded');

    // Check if StatusBadges with expected titles exist
    expect(wrapper.find('StatusBadge').at(0).prop('title')).toEqual('Training');
    expect(wrapper.find('StatusBadge').at(1).prop('title')).toEqual('Peers');
    expect(wrapper.find('StatusBadge').at(2).prop('title')).toEqual('Self');
    expect(wrapper.find('StatusBadge').at(3).prop('title')).toEqual('Staff');
  });
});
