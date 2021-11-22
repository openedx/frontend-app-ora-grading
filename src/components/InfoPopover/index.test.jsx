import React from 'react';
import { shallow } from 'enzyme';

import { formatMessage } from 'testUtils';
import { InfoPopover } from '.';

describe('Info Popover Component', () => {
  const child = <div>Children component</div>;
  test('snapshot', () => {
    expect(shallow(<InfoPopover intl={{ formatMessage }}>{child}</InfoPopover>)).toMatchSnapshot();
  });

  describe('Component', () => {
    let el;
    beforeEach(() => {
      el = shallow(<InfoPopover intl={{ formatMessage }}>{child}</InfoPopover>);
    });
    test('Test component render', () => {
      expect(el.length).toEqual(1);
      expect(el.find('.esg-help-icon').length).toEqual(1);
    });
  });
});
