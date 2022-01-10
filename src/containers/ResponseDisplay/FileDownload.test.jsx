import React from 'react';
import { shallow } from 'enzyme';

import { RequestKeys, RequestStates } from 'data/constants/requests';
import { selectors, thunkActions } from 'data/redux';
import {
  mapStateToProps,
  mapDispatchToProps,
  FileDownload,
  statusMapping,
} from './FileDownload';

jest.mock('data/redux', () => ({
  selectors: {
    requests: { requestStatus: (...args) => ({ requestStatus: args }) },
  },
  thunkActions: {
    download: { downloadFiles: jest.fn() },
  },
}));

describe('FileDownload', () => {
  describe('component', () => {
    const props = {
      requestStatus: { status: RequestStates.inactive },
    };
    let el;
    beforeEach(() => {
      props.downloadFiles = jest.fn().mockName('this.props.downloadFiles');
      el = shallow(<FileDownload {...props} />);
    });
    describe('snapshot', () => {
      test('download is inactive', () => {
        expect(el).toMatchSnapshot();
        expect(el.at(0).props().state).toEqual(statusMapping[RequestStates.inactive]);
      });
      test('download is pending', () => {
        el.setProps({ requestStatus: { status: RequestStates.pending } });
        expect(el).toMatchSnapshot();
        expect(el.at(0).props().state).toEqual(statusMapping[RequestStates.pending]);
      });
      test('download is completed', () => {
        el.setProps({ requestStatus: { status: RequestStates.completed } });
        expect(el).toMatchSnapshot();
        expect(el.at(0).props().state).toEqual(statusMapping[RequestStates.completed]);
      });
      test('download is failed', () => {
        el.setProps({ requestStatus: { status: RequestStates.failed } });
        expect(el).toMatchSnapshot();
        expect(el.at(0).props().state).toEqual(statusMapping[RequestStates.failed]);
      });
    });
  });
  describe('mapStateToProps', () => {
    let mapped;
    const requestKey = RequestKeys.downloadFiles;
    const testState = { some: 'test-state' };
    beforeEach(() => {
      mapped = mapStateToProps(testState);
    });
    test('requestStatus loads from requests.requestStatus(downloadFiles)', () => {
      expect(mapped.requestStatus).toEqual(selectors.requests.requestStatus(testState, { requestKey }));
    });
  });
  describe('mapDispatchToProps', () => {
    it('loads downloadFiles from thunkActions.download.downloadFiles', () => {
      expect(mapDispatchToProps.downloadFiles).toEqual(thunkActions.download.downloadFiles);
    });
  });
});
