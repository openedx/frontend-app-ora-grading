/* eslint-disable prefer-promise-reject-errors */
import { useEffect } from 'react';
import * as axios from 'axios';

import { keyStore } from 'utils';
import { MockUseState } from 'testUtils';
import * as hooks from './textHooks';

jest.mock('axios', () => ({
  get: jest.fn(),
}));

const hookKeys = keyStore(hooks);
const state = new MockUseState(hooks);

let hook;

const testValue = 'test-value';

const props = {
  url: 'test-url',
  onError: jest.fn(),
  onSuccess: jest.fn(),
};
describe('Text file preview hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('state hooks', () => {
    state.testGetter(state.keys.content);
  });
  describe('non-state hooks', () => {
    beforeEach(() => {
      state.mock();
    });
    afterEach(() => {
      state.restore();
    });
    describe('rendererHooks', () => {
      it('returns content tied to hook state', () => {
        hook = hooks.rendererHooks(props);
        expect(hook.content).toEqual(state.stateVals.content);
        expect(hook.content).toEqual('');
      });
      describe('initialization behavior', () => {
        let cb;
        let prereqs;
        const loadHook = () => {
          hook = hooks.rendererHooks(props);
          [[cb, prereqs]] = useEffect.mock.calls;
        };
        it('calls fetchFile method, predicated on setContent, url, and callbacks', () => {
          jest.spyOn(hooks, hookKeys.fetchFile).mockImplementationOnce(() => {});
          loadHook();
          expect(useEffect).toHaveBeenCalled();
          expect(prereqs).toEqual([
            props.onError,
            props.onSuccess,
            state.setState.content,
            props.url,
          ]);
          expect(hooks.fetchFile).not.toHaveBeenCalled();
          cb();
          expect(hooks.fetchFile).toHaveBeenCalledWith({
            onError: props.onError,
            onSuccess: props.onSuccess,
            setContent: state.setState.content,
            url: props.url,
          });
        });
      });
    });
    describe('fetchFile', () => {
      describe('onSuccess', () => {
        it('calls get', async () => {
          const testData = 'test-data';
          axios.get.mockReturnValueOnce(Promise.resolve({ data: testData }));
          await hooks.fetchFile({ ...props, setContent: state.setState.content });
          expect(props.onSuccess).toHaveBeenCalled();
          expect(state.setState[state.keys.content]).toHaveBeenCalledWith(testData);
        });
      });
      describe('onError', () => {
        it('calls get on the passed url when it changes', async () => {
          axios.get.mockReturnValueOnce(Promise.reject(
            { response: { status: testValue } },
          ));
          await hooks.fetchFile({ ...props, setContent: state.setState.content });
          expect(props.onError).toHaveBeenCalledWith(testValue);
        });
      });
    });
  });
});
