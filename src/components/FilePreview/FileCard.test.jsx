import React from 'react';
import { shallow } from 'enzyme';

import { Collapsible } from '@edx/paragon';
import FileCard from './FileCard';

describe('File Preview Card component', () => {
  const props = {
    name: 'test-file-name.pdf',
  };
  const children = (<h1>some children</h1>);
  let el;
  beforeEach(() => {
    el = shallow(<FileCard {...props}>{children}</FileCard>);
  });
  test('snapshot', () => {
    expect(el).toMatchSnapshot();
  });
  describe('Component', () => {
    test('collapsible title is name header', () => {
      const title = el.find(Collapsible).prop('title');
      expect(title).toEqual(<h3>{props.name}</h3>);
    });
    test('forwards children into preview-panel', () => {
      expect(el.find('.preview-panel').children().equals(children)).toEqual(true);
    });
  });
});
