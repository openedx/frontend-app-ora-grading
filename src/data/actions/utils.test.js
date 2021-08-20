import { createAction } from '@reduxjs/toolkit';
import * as utils from './utils';

jest.mock('@reduxjs/toolkit', () => ({
  createAction: (key, ...args) => ({ action: key, args }),
}));

describe('redux action utils', () => {
  describe('createActionFactory', () => {
    it('returns an action creator with the data key', () => {
      const dataKey = 'part-of-the-model';
      const actionKey = 'an-action';
      const args = ['some', 'args'];
      expect(utils.createActionFactory(dataKey)(actionKey, ...args)).toEqual(
        createAction(`${dataKey}/${actionKey}`, ...args),
      );
    });
  });
});
