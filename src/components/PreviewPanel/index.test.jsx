import React from 'react';
import { shallow } from 'enzyme';

import { PreviewPanel } from '.';

describe('Preview Panel Component', () => {
  const props = {
    uri: 'some_url.pdf',
  };

  let el;
  beforeEach(() => {
    el = shallow(<PreviewPanel {...props} />);
  });
  test('snapshot', () => {
    expect(el).toMatchSnapshot();
  });

  describe('Component', () => {
    test('Test component render', () => {
      expect(el.isEmptyRender()).toEqual(false);
    });
  });
});
