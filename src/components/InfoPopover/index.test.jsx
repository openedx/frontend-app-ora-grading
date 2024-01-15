import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';

import { formatMessage } from 'testUtils';
import { InfoPopover } from '.';

describe('Info Popover Component', () => {
  const child = <div>Children component</div>;
  const onClick = jest.fn().mockName('this.props.onClick');
  let el;
  beforeEach(() => {
    el = shallow(<InfoPopover onClick={onClick} intl={{ formatMessage }}>{child}</InfoPopover>);
  });
  test('snapshot', () => {
    expect(el.snapshot).toMatchSnapshot();
  });
  describe('Component', () => {
    test('Test component render', () => {
      expect(typeof el.shallowWrapper.props.children.props).toBe('object');
      expect(el.shallowWrapper.props.children.props.className).toBe('esg-help-icon');
    });
  });
});
