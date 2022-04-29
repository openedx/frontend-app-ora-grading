import React from 'react';
import { shallow } from 'enzyme';

import TXTRenderer from './TXTRenderer';

jest.mock('./textHooks', () => {
  const content = 'test-content';
  return {
    content,
    rendererHooks: (args) => ({ content, rendererHooks: args }),
  };
});

describe('TXT Renderer Component', () => {
  const props = {
    url: 'some_url.txt',
    onError: jest.fn().mockName('this.props.onError'),
    onSuccess: jest.fn().mockName('this.props.onSuccess'),
  };
  test('snapshot', () => {
    expect(shallow(<TXTRenderer {...props} />)).toMatchSnapshot();
  });
});
