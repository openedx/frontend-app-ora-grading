import React from 'react';
import { shallow } from 'enzyme';

import TXTRenderer from './TXTRenderer';

jest.mock('axios', () => ({
  get: jest.fn((...args) => Promise.resolve({ data: `Content of ${args}` })),
}));

describe('TXT Renderer Component', () => {
  const props = {
    url: 'some_url.txt',
  };

  props.onError = jest.fn().mockName('this.props.onError');
  props.onSuccess = jest.fn().mockName('this.props.onSuccess');

  let el;
  beforeEach(() => {
    el = shallow(<TXTRenderer {...props} />);
  });
  test('snapshot', () => {
    expect(el).toMatchSnapshot();
  });
});
