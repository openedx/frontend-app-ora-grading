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
      expect(el.instance.children.length).toEqual(1);
      expect(el.instance.findByTestId('esg-help-icon').length).toEqual(1);
    });
  });
});
