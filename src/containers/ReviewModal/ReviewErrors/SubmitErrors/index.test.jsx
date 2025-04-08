import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';

import { keyStore } from '@src/utils';
import { formatMessage } from '@src/testUtils';

import * as hooks from './hooks';
import { SubmitErrors } from '.';

jest.mock('../ReviewError', () => 'ReviewError');

const hookKeys = keyStore(hooks);
describe('SubmitErrors component', () => {
  const props = { intl: { formatMessage } };
  describe('snapshots', () => {
    test('snapshot: no failure', () => {
      jest.spyOn(hooks, hookKeys.rendererHooks).mockReturnValueOnce({ show: false });
      const el = shallow(<SubmitErrors {...props} />);
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
      expect(shallow(<SubmitErrors {...props} />).snapshot).toMatchSnapshot();
    });
  });
});
