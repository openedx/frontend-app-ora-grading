import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';

import { useDispatch } from 'react-redux';

import * as hooks from './hooks';
import { StartGradingButton } from '.';

jest.mock('../OverrideGradeConfirmModal', () => 'OverrideGradeConfirmModal');
jest.mock('../StopGradingConfirmModal', () => 'StopGradingConfirmModal');

jest.mock('./hooks', () => ({
  buttonHooks: jest.fn(),
}));

let el;
describe('StartGradingButton component', () => {
  describe('component', () => {
    const dispatch = useDispatch();
    const buttonHooks = {
      hide: false,
      buttonArgs: { props: 'hooks.buttonArgs' },
      overrideGradeArgs: { props: 'hooks.overrideGradeArgs' },
      stopGradingArgs: { props: 'hooks.stopGradingArgs' },
    };
    describe('behavior', () => {
      it('initializes buttonHooks with dispatch and intl fields', () => {
        hooks.buttonHooks.mockReturnValueOnce(buttonHooks);
        el = shallow(<StartGradingButton />);
        const expected = { dispatch, intl: { formatMessage: expect.any(Function), formatDate: expect.any(Function) } };
        expect(hooks.buttonHooks).toHaveBeenCalledWith(expected);
      });
    });
    describe('snapshots', () => {
      test('hide: renders empty component if hook.hide is true', () => {
        hooks.buttonHooks.mockReturnValueOnce({ ...buttonHooks, hide: true });
        el = shallow(<StartGradingButton />);
        expect(el.snapshot).toMatchSnapshot();
        expect(el.isEmptyRender()).toEqual(true);
      });
      test('smoke test: forwards props to components from hooks', () => {
        hooks.buttonHooks.mockReturnValueOnce(buttonHooks);
        el = shallow(<StartGradingButton />);
        expect(el.snapshot).toMatchSnapshot();
        expect(el.isEmptyRender()).toEqual(false);
      });
    });
  });
});
