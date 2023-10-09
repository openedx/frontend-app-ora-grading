import React from 'react';
import { shallow } from 'enzyme';

import { useDispatch } from 'react-redux';

import { formatMessage } from 'testUtils';
import * as hooks from './hooks';
import { StartGradingButton } from '.';

jest.mock('../OverrideGradeConfirmModal', () => 'OverrideGradeConfirmModal');
jest.mock('../StopGradingConfirmModal', () => 'StopGradingConfirmModal');

jest.mock('./hooks', () => ({
  buttonHooks: jest.fn(),
}));

const intl = { formatMessage };

let el;
describe('StartGradingButton component', () => {
  describe('component', () => {
    const dispatch = useDispatch();
    const props = { intl };
    const buttonHooks = {
      hide: false,
      buttonArgs: { props: 'hooks.buttonArgs' },
      overrideGradeArgs: { props: 'hooks.overrideGradeArgs' },
      stopGradingArgs: { props: 'hooks.stopGradingArgs' },
    };
    describe('behavior', () => {
      it('initializes buttonHooks with dispatch and intl fields', () => {
        hooks.buttonHooks.mockReturnValueOnce(buttonHooks);
        el = shallow(<StartGradingButton {...props} />);
        expect(hooks.buttonHooks).toHaveBeenCalledWith({ dispatch, intl });
      });
    });
    describe('snapshots', () => {
      test('hide: renders empty component if hook.hide is true', () => {
        hooks.buttonHooks.mockReturnValueOnce({ ...buttonHooks, hide: true });
        el = shallow(<StartGradingButton {...props} />);
        expect(el).toMatchSnapshot();
        expect(el.isEmptyRender()).toEqual(true);
      });
      test('smoke test: forwards props to components from hooks', () => {
        hooks.buttonHooks.mockReturnValueOnce(buttonHooks);
        el = shallow(<StartGradingButton {...props} />);
        expect(el).toMatchSnapshot();
        expect(el.isEmptyRender()).toEqual(false);
      });
    });
  });
});
