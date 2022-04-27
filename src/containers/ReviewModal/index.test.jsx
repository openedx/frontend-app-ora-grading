import React from 'react';
import { useDispatch } from 'react-redux';
import { shallow } from 'enzyme';

import { formatMessage } from 'testUtils';

import * as hooks from './hooks';
import { ReviewModal } from '.';

jest.useFakeTimers('modern');

jest.mock('components/LoadingMessage', () => 'LoadingMessage');
jest.mock('containers/DemoWarning', () => 'DemoWarning');
jest.mock('containers/ReviewActions', () => 'ReviewActions');
jest.mock('./ReviewContent', () => 'ReviewContent');
jest.mock('./components/CloseReviewConfirmModal', () => 'CloseReviewConfirmModal');

jest.mock('./hooks', () => ({
  rendererHooks: jest.fn(),
}));

const dispatch = useDispatch();

describe('ReviewModal component', () => {
  const hookProps = {
    isLoading: false,
    title: 'test-ora-name',
    onClose: jest.fn().mockName('hooks.onClose'),
    isOpen: false,
    closeConfirmModalProps: {
      prop: 'hooks.closeConfirmModalProps',
    },
  };

  const render = (newVals) => {
    hooks.rendererHooks.mockReturnValueOnce({ ...hookProps, ...newVals });
    return shallow(<ReviewModal intl={{ formatMessage }} />);
  };
  describe('component', () => {
    describe('snapshots', () => {
      test('closed', () => {
        expect(render()).toMatchSnapshot();
      });
      test('loading', () => {
        expect(render({ isOpen: true, isLoading: true })).toMatchSnapshot();
      });
      test('success', () => {
        expect(render({ isOpen: true })).toMatchSnapshot();
      });
    });
  });
  describe('behavior', () => {
    it('initializes renderer hook with dispatch and intl props', () => {
      render();
      expect(hooks.rendererHooks).toHaveBeenCalledWith({ dispatch, intl: { formatMessage } });
    });
  });
});
