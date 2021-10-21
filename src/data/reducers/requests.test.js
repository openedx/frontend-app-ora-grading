import actions from 'data/actions';
import { RequestStates } from 'data/constants/requests';
import requests, { initialState } from './requests';

const testingState = {
  ...initialState,
  arbitraryField: 'arbitrary',
};

describe('requests reducer', () => {
  it('has initial state', () => {
    expect(requests(undefined, {})).toEqual(initialState);
  });

  const testValue = 'roll for initiative';
  const testKey = 'test-key';
  describe('handling actions', () => {
    describe('requests.startRequest', () => {
      it('adds a pending status for the given key', () => {
        expect(requests(
          testingState,
          actions.requests.startRequest(testKey),
        )).toEqual({
          ...testingState,
          [testKey]: { status: RequestStates.pending },
        });
      });
    });
    describe('requests.completeRequest', () => {
      it('adds a completed status with passed response', () => {
        expect(requests(
          testingState,
          actions.requests.completeRequest({ requestKey: testKey, response: testValue }),
        )).toEqual({
          ...testingState,
          [testKey]: { status: RequestStates.completed, response: testValue },
        });
      });
    });
    describe('requests.failRequest', () => {
      it('adds a failed status with passed error', () => {
        expect(requests(
          testingState,
          actions.requests.failRequest({ requestKey: testKey, error: testValue }),
        )).toEqual({
          ...testingState,
          [testKey]: { status: RequestStates.failed, error: testValue },
        });
      });
    });
  });
});
