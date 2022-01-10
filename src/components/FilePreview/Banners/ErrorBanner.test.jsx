import React from 'react';
import { shallow } from 'enzyme';

import ErrorBanner from './ErrorBanner';

import messages from '../messages';

describe('Error Banner component', () => {
  const children = <p>Abitary Child</p>;

  const props = {
    actions: [
      {
        id: 'test 1',
        onClick: jest.fn().mockName('test 1 on click'),
        message: messages.retryButton,
      },
      {
        id: 'test 2',
        onClick: jest.fn().mockName('test 2 on click'),
        message: messages.retryButton,
      },
    ],
    headingMessage: messages.unknownError,
    children,
  };

  let el;
  beforeEach(() => {
    el = shallow(<ErrorBanner {...props} />);
  });

  test('snapshot', () => {
    expect(el).toMatchSnapshot();
  });

  describe('component', () => {
    test('children node', () => {
      expect(el.containsMatchingElement(children)).toEqual(true);
    });

    test('actions count', () => {
      const actions = el.find('Alert').prop('actions');
      expect(actions).toHaveLength(props.actions.length);
      actions.forEach(action => expect(action.type).toEqual('Button'));
    });
  });
});
