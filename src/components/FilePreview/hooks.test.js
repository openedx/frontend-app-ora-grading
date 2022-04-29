import { MockUseState, formatMessage } from 'testUtils';
import { keyStore } from 'utils';

import { ErrorStatuses } from 'data/constants/requests';

import * as hooks from './hooks';

const testValue = 'Test-Value';
const state = new MockUseState(hooks);
const hookKeys = keyStore(hooks);

let hook;
describe('FilePreview hooks', () => {
  describe('state hooks', () => {
  });
  describe('non-state hooks', () => {
    beforeEach(() => {
      state.mock();
    });
    afterEach(() => {
      state.restore();
    });
    describe('utility methods', () => {
      describe('getFileType', () => {
        it('returns file extension if available, in lowercase', () => {
          expect(hooks.getFileType('thing.TXT')).toEqual('txt');
          expect(hooks.getFileType(testValue)).toEqual(testValue.toLowerCase());
        });
      });
      describe('isSupported', () => {
        it('returns true iff the filetype is included in SUPPORTED_TYPES', () => {
          let spy = jest.spyOn(hooks, hookKeys.getFileType).mockImplementationOnce(v => v);
          expect(hooks.isSupported({ name: hooks.SUPPORTED_TYPES[0] })).toEqual(true);
          spy = jest.spyOn(hooks, hookKeys.getFileType).mockImplementationOnce(v => v);
          expect(hooks.isSupported({ name: testValue })).toEqual(false);
          spy.mockRestore();
        });
      });
    });
    describe('component hooks', () => {
      describe('renderHooks', () => {
        const file = {
          name: 'test-file-name.txt',
          downloadUrl: 'my-test-download-url.jpg',
        };
        beforeEach(() => {
          hook = hooks.renderHooks({ intl: { formatMessage }, file });
        });
        describe('returned object', () => {
          test('errorStatus and isLoading tied to state, initialized to null and true', () => {
            expect(hook.errorStatus).toEqual(state.stateVals.errorStatus);
            expect(hook.errorStatus).toEqual(null);
            expect(hook.isLoading).toEqual(state.stateVals.isLoading);
            expect(hook.isLoading).toEqual(true);
          });
          describe('error', () => {
            it('loads message from current error status, if valid, else from serverError', () => {
              expect(hook.error.headerMessage).toEqual(
                hooks.ERROR_STATUSES[ErrorStatuses.serverError],
              );
              expect(hook.error.children).toEqual(
                formatMessage(hooks.ERROR_STATUSES[ErrorStatuses.serverError]),
              );
              state.mockVal(state.keys.errorStatus, ErrorStatuses.notFound);
              hook = hooks.renderHooks({ intl: { formatMessage }, file });
              expect(hook.error.headerMessage).toEqual(
                hooks.ERROR_STATUSES[ErrorStatuses.notFound],
              );
              expect(hook.error.children).toEqual(
                formatMessage(hooks.ERROR_STATUSES[ErrorStatuses.notFound]),
              );
            });
            it('provides a single action', () => {
              expect(hook.error.actions.length).toEqual(1);
            });
            describe('action', () => {
              it('sets errorState to null and isLoading to true on click', () => {
                hook.error.actions[0].onClick();
                expect(state.setState.isLoading).toHaveBeenCalledWith(true);
                expect(state.setState.errorStatus).toHaveBeenCalledWith(null);
              });
            });
          });
          describe('Renderer', () => {
            it('returns configured renderer based on filetype', () => {
              hooks.SUPPORTED_TYPES.forEach(type => {
                jest.spyOn(hooks, hookKeys.getFileType).mockReturnValueOnce(type);
                hook = hooks.renderHooks({ intl: { formatMessage }, file });
                expect(hook.Renderer).toEqual(hooks.RENDERERS[type]);
              });
            });
          });
          describe('rendererProps', () => {
            it('forwards url and fileName from file', () => {
              expect(hook.rendererProps.fileName).toEqual(file.name);
              expect(hook.rendererProps.url).toEqual(file.downloadUrl);
            });
            describe('onError', () => {
              it('it sets isLoading to false and loads errorStatus', () => {
                hook.rendererProps.onError(testValue);
                expect(state.setState.isLoading).toHaveBeenCalledWith(false);
                expect(state.setState.errorStatus).toHaveBeenCalledWith(testValue);
              });
            });
            describe('onSuccess', () => {
              it('it sets isLoading to false and errorStatus to null', () => {
                hook.rendererProps.onSuccess(testValue);
                expect(state.setState.isLoading).toHaveBeenCalledWith(false);
                expect(state.setState.errorStatus).toHaveBeenCalledWith(null);
              });
            });
          });
        });
      });
    });
  });
});
