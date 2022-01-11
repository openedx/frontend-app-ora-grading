import React from 'react';
import { shallow } from 'enzyme';

import ErrorBanner from './ErrorBanner';

import messages from '../messages';

describe('Error Banner component', () => {
  const children = <p>Abitary Child</p>;

  const props = {
    actions: [
      {
        id: 'action1',
        onClick: jest.fn().mockName('action1.onClick'),
        message: messages.retryButton,
      },
      {
        id: 'action2',
        onClick: jest.fn().mockName('action2.onClick'),
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

    test('verify actions', () => {
      const actions = el.find('Alert').prop('actions');
      expect(actions).toHaveLength(props.actions.length);

      actions.forEach((action, index) => {
        expect(action.type).toEqual('Button');
        expect(action.props.onClick).toEqual(props.actions[index].onClick);
        // action message
        expect(action.props.children.props).toEqual(props.actions[index].message);
      });
    });

    test('verify heading', () => {
      const heading = el.find('FormattedMessage');
      expect(heading.props()).toEqual(props.headingMessage);
    });
  });
});
