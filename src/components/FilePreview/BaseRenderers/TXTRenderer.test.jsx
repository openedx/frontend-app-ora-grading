import React from 'react';
import { shallow } from 'enzyme';

import TXTRenderer from './TXTRenderer';

jest.mock('data/services/lms/utils', () => ({
  get: jest.fn((...args) => Promise.resolve({ data: `Content of ${args}` })),
}));

describe('Image Renderer Component', () => {
  const props = {
    url: 'some_url.txt',
    onError: jest.fn().mockName('onError'),
    onSuccess: jest.fn().mockName('onSuccess'),
  };

  let el;
  beforeEach(() => {
    el = shallow(<TXTRenderer {...props} />);
  });
  test('snapshot', () => {
    expect(el).toMatchSnapshot();
  });
});
