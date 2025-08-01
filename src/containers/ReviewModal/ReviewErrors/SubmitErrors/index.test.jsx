import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';

import { keyStore } from 'utils';

import * as hooks from './hooks';
import { SubmitErrors } from '.';

jest.mock('../ReviewError', () => 'ReviewError');

const hookKeys = keyStore(hooks);
describe('SubmitErrors component', () => {
  describe('snapshots', () => {
    test('snapshot: no failure', () => {
      jest.spyOn(hooks, hookKeys.rendererHooks).mockReturnValueOnce({ show: false });
      const el = shallow(<SubmitErrors />);
      expect(el.snapshot).toMatchSnapshot();
      expect(el.isEmptyRender()).toEqual(true);
    });
    test('snapshot: with valid error, loads from hook', () => {
      const mockHook = {
        show: true,
        reviewActions: {
          confirm: 'hooks.reviewActions.confirm',
          cancel: 'hooks.reviewActions.cancel',
        },
        headingMessage: 'hooks.headingMessage',
        content: 'hooks.content',
      };
      jest.spyOn(hooks, hookKeys.rendererHooks).mockReturnValueOnce(mockHook);
      expect(shallow(<SubmitErrors />).snapshot).toMatchSnapshot();
    });
  });
});
