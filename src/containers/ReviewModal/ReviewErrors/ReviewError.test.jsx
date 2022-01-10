import React from 'react';
import { shallow } from 'enzyme';

import { Button } from '@edx/paragon';
import { FormattedMessage } from '@edx/frontend-platform/i18n';

import ReviewError from './ReviewError';

let el;
const messages = {
  heading: {
    id: 'test-header-message',
    defaultMessage: 'Test Header Message',
  },
  cancel: {
    id: 'test-cancel-message',
    defaultMessage: 'Test Cancel Message',
  },
  confirm: {
    id: 'test-confirm-message',
    defaultMessage: 'Test Confirm Message',
  },
};
const cancel = {
  onClick: jest.fn().mockName('this.props.cancel.onClick'),
  message: messages.cancel,
};
const confirm = {
  onClick: jest.fn().mockName('this.props.confirm.onClick'),
  message: messages.confirm,
};

const confirmBtn = (
  <Button key="confirm" onClick={confirm.onClick}>
    <FormattedMessage {...confirm.message} />
  </Button>
);

const cancelBtn = (
  <Button key="cancel" variant="outline-primary" onClick={cancel.onClick}>
    <FormattedMessage {...cancel.message} />
  </Button>
);

describe('ReviewError component', () => {
  describe('component', () => {
    const props = {
      headingMessage: messages.heading,
    };
    const children = <div>Test Children</div>;
    describe('snapshots', () => {
      test('no actions', () => {
        el = shallow(<ReviewError {...props}>{children}</ReviewError>);
        expect(el).toMatchSnapshot();
        const { actions } = el.at(0).props();
        expect(actions).toEqual([]);
      });
      test('cancel only', () => {
        el = shallow(<ReviewError {...props} actions={{ cancel }}>{children}</ReviewError>);
        expect(el).toMatchSnapshot();
        const { actions } = el.at(0).props();
        expect(actions.length).toEqual(1);
        expect(actions[0]).toEqual(cancelBtn);
      });
      test('confirm only', () => {
        el = shallow(<ReviewError {...props} actions={{ confirm }}>{children}</ReviewError>);
        expect(el).toMatchSnapshot();
        const { actions } = el.at(0).props();
        expect(actions.length).toEqual(1);
        expect(actions[0]).toEqual(confirmBtn);
      });
      test('cancel and confirm', () => {
        el = shallow(<ReviewError {...props} actions={{ cancel, confirm }}>{children}</ReviewError>);
        expect(el).toMatchSnapshot();
        const { actions } = el.at(0).props();
        expect(actions.length).toEqual(2);
        expect(actions[0]).toEqual(cancelBtn);
        expect(actions[1]).toEqual(confirmBtn);
      });
    });
  });
});
