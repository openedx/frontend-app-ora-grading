import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';
import { Alert } from '@openedx/paragon';
import { Info } from '@openedx/paragon/icons';
import ErrorMessage from '.';

describe('ErrorMessage component', () => {
  const defaultProps = {
    title: 'Error Title',
    message: 'Error Message',
  };
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<ErrorMessage {...defaultProps} />);
  });

  test('renders without crashing', () => {
    expect(wrapper.exists()).toBe(true);
  });

  test('renders an Alert component', () => {
    expect(wrapper.find(Alert)).toHaveLength(1);
  });

  test('renders Alert with correct props', () => {
    const alertComponent = wrapper.find(Alert);

    expect(alertComponent.prop('variant')).toBe('danger');
    expect(alertComponent.prop('icon')).toBe(Info);
    expect(alertComponent.prop('stacked')).toBe(true);
  });

  test('renders Alert.Heading with provided title', () => {
    const title = 'Error Title Testing';
    const message = 'Error Message';
    wrapper = shallow(<ErrorMessage title={title} message={message} />);
    const alertHeading = wrapper.find('[data-testid="title-heading"]');
    expect(alertHeading.exists()).toBe(true);
    expect(alertHeading.text()).toBe(title);
  });

  test('renders message within the Alert', () => {
    const title = 'Error Title';
    const message = 'Error Message Testing';
    wrapper = shallow(<ErrorMessage title={title} message={message} />);
    const alertMessage = wrapper.find('[data-testid="message"]');
    expect(alertMessage.exists()).toBe(true);
    expect(alertMessage.text()).toBe(message);
  });
});
