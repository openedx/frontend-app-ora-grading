import React from 'react';
import { shallow } from 'enzyme';

import ImageRenderer from './ImageRenderer';

describe('Image Renderer Component', () => {
  const props = {
    url: 'some_url.pdf',
  };

  let el;
  beforeEach(() => {
    el = shallow(<ImageRenderer {...props} />);
  });
  test('snapshot', () => {
    expect(el).toMatchSnapshot();
  });

  describe('Component', () => {
    const supportedTypes = ['jpg', 'jpeg', 'png', 'bmp'];
    test('static supported types is expected', () => {
      expect(ImageRenderer.supportedTypes).toEqual(supportedTypes);
    });
  });
});
