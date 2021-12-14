import React from 'react';
import { shallow } from 'enzyme';

import ImageRenderer from './ImageRenderer';

describe('Image Renderer Component', () => {
  const props = {
    url: 'some_url.jpg',
  };

  let el;
  beforeEach(() => {
    el = shallow(<ImageRenderer {...props} />);
  });
  test('snapshot', () => {
    expect(el).toMatchSnapshot();
  });
});
