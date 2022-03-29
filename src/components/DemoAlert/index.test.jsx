import React from 'react';
import { shallow } from 'enzyme';

import { formatMessage } from 'testUtils';
import { DemoAlert } from '.';

describe('DemoAlert component', () => {
  test('snapshot', () => {
    const props = {
      intl: { formatMessage },
      isOpen: true,
      onClose: jest.fn().mockName('props.onClose'),
    };
    expect(shallow(<DemoAlert {...props} />)).toMatchSnapshot();
  });
});
