import React from 'react';
import { shallow } from 'enzyme';

import { Popover } from '@edx/paragon';

import FileInfo from './FileInfo';

describe('File Preview Card component', () => {
  const children = (<h1>some Children</h1>);
  const props = { onClick: jest.fn().mockName('this.props.onClick') };
  let el;
  beforeEach(() => {
    el = shallow(<FileInfo {...props}>{children}</FileInfo>);
  });
  test('snapshot', () => {
    expect(el).toMatchSnapshot();
  });
  describe('Component', () => {
    test('overlay with passed children', () => {
      const { overlay } = el.at(0).props();
      expect(overlay.type).toEqual(Popover);
      expect(overlay.props.children).toEqual(<Popover.Content>{children}</Popover.Content>);
    });
  });
});
