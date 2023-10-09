import React from 'react';
import { shallow, mount } from 'enzyme';
import ResponseItem from '.';

describe('ResponseItem component', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<ResponseItem title="Title" response="Response Content" />);
    expect(wrapper.exists()).toBe(true);
  });

  it('displays the title and response', () => {
    const title = 'Title';
    const response = 'Response Content';
    const wrapper = shallow(<ResponseItem title={title} response={response} />);
    expect(wrapper.find('h4').text()).toBe(title);
    expect(wrapper.find('.collapsible-body').text()).toBe(response);
  });

  it('collapses when trigger is clicked twice', () => {
    const title = 'Title';
    const response = 'Response Content';
    const wrapper = mount(<ResponseItem title={title} response={response} />);

    // Click on the trigger to expand
    wrapper.find('.collapsible-trigger').simulate('click');
    // Click again to collapse
    wrapper.find('.collapsible-trigger').simulate('click');
    // After clicking twice, the Collapsible should be closed
    expect(wrapper.find('.collapsible-body').hasClass('collapsible-body--open')).toBe(false);
  });
});
