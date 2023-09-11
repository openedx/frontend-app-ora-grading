import React from 'react';
import { shallow } from 'enzyme';

import { selectors, actions, thunkActions } from 'data/redux';
import { RequestKeys } from 'data/constants/requests';

import {
  DownloadErrors,
  mapStateToProps,
  mapDispatchToProps,
} from './DownloadErrors';

let el;

jest.mock('data/redux', () => ({
  selectors: {
    requests: {
      isFailed: (...args) => ({ isFailed: args }),
      error: (...args) => ({ error: args }),
    },
  },
  actions: {
    requests: { clearRequest: jest.fn() },
  },
  thunkActions: {
    download: { downloadFiles: jest.fn() },
  },
}));
jest.mock('./ReviewError', () => 'ReviewError');

describe('DownloadErrors component', () => {
  const props = {
    isFailed: false,
    error: {
      files: [],
    },
  };
  describe('component', () => {
    beforeEach(() => {
      props.clearState = jest.fn();
      props.downloadFiles = jest.fn().mockName('this.props.downloadFiles');
      el = shallow(<DownloadErrors {...props} />);
    });
    describe('snapshots', () => {
      beforeEach(() => {
        el.instance().cancelAction = jest.fn().mockName('this.cancelAction');
      });
      test('failed: show error', () => {
        el.setProps({
          isFailed: true,
          error: {
            files: ['file-1-failed.error', 'file-2.failed'],
          },
        });
        expect(el.instance().render()).toMatchSnapshot();
        expect(el.isEmptyRender()).toEqual(false);
      });
      test('not failed: hide error', () => {
        expect(el).toMatchSnapshot();
        expect(el.isEmptyRender()).toEqual(true);
      });
    });
    describe('behavior', () => {
      describe('clearState', () => {
        it('calls props.clearState with requestKey: downloadFiles', () => {
          el.instance().cancelAction();
          expect(props.clearState).toHaveBeenCalledWith({ requestKey: RequestKeys.downloadFiles });
        });
      });
    });
  });
  describe('mapStateToProps', () => {
    let mapped;
    const testState = { some: 'test-state' };
    beforeEach(() => {
      mapped = mapStateToProps(testState);
    });
    test('isFailed loads from requests.isFailed(downloadFiles)', () => {
      const requestKey = RequestKeys.downloadFiles;
      expect(mapped.isFailed).toEqual(selectors.requests.isFailed(testState, { requestKey }));
    });
    test('error loads from requests.error(downloadFiles)', () => {
      const requestKey = RequestKeys.downloadFiles;
      expect(mapped.error).toEqual(selectors.requests.error(testState, { requestKey }));
    });
  });
  describe('mapDispatchToProps', () => {
    it('loads clearState from actions.requests.clearRequest', () => {
      expect(mapDispatchToProps.clearState).toEqual(actions.requests.clearRequest);
    });
    it('loads downloadFiles from thunkActions.download.downloadFiles', () => {
      expect(mapDispatchToProps.downloadFiles).toEqual(thunkActions.download.downloadFiles);
    });
  });
});
