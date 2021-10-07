import React from 'react';
import { shallow } from 'enzyme';

import InfoPopover from './InfoPopover';

jest.mock('@edx/paragon', () => ({
  OverlayTrigger: () => 'OverlayTrigger',
  Icon: () => 'Icon',
  IconButton: () => 'IconButton',
  Popover: () => 'Popover',
  PopoverContent: () => 'PopoverContent',
}));

jest.mock('@edx/paragon/icons', () => ({
  InfoOutline: jest.fn().mockName('icons.InfoOutline'),
}));

describe('Info Popover Component', () => {
  const child = <div>Children component</div>;
  test('snapshot', () => {
    expect(
      shallow(<InfoPopover>{child}</InfoPopover>),
    ).toMatchSnapshot();
  });

  describe('Component', () => {
    let el;
    beforeEach(() => {
      el = shallow(<InfoPopover>{child}</InfoPopover>);
    });
    test('Test component render', () => {
      expect(el.length).toEqual(1);
      expect(el.find('.criteria-help-icon').length).toEqual(1);
    });
  });
});
