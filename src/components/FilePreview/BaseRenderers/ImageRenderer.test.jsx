import React from 'react';
import { shallow } from 'enzyme';

import ImageRenderer from './ImageRenderer';

describe('Image Renderer Component', () => {
  const props = {
    url: 'some_url.jpg',
  };

  props.onError = jest.fn().mockName('onError');
  props.onSuccess = jest.fn().mockName('onSuccess');

  let el;
  beforeEach(() => {
    el = shallow(<ImageRenderer {...props} />);
  });
  test('snapshot', () => {
    expect(el).toMatchSnapshot();
  });
});
