import React from 'react';
import { shallow } from 'enzyme';

import ImageRenderer from './ImageRenderer';

describe('Image Renderer Component', () => {
  const props = {
    url: 'some_url.jpg',
  };

  props.onError = jest.fn().mockName('this.props.onError');
  props.onSuccess = jest.fn().mockName('this.props.onSuccess');

  let el;
  beforeEach(() => {
    el = shallow(<ImageRenderer {...props} />);
  });
  test('snapshot', () => {
    expect(el).toMatchSnapshot();
  });
});
