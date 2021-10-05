import api from 'data/services/lms/api';
import { locationId } from 'data/constants/app';

import actions from 'data/actions';
import thunkActions from './app';

jest.mock('data/services/lms/api', () => {
  const response = {
    oraMetadata: { some: 'ora-metadata' },
    courseMetadata: { some: 'course-metadata' },
    submissions: { some: 'submissions' },
  };
  return {
    response,
    initializeApp: jest.fn(() => new Promise((resolve) => resolve(response))),
  };
});
jest.mock('data/constants/app', () => ({
  locationId: 'fake-location-id',
}));
jest.mock('data/actions', () => ({
  app: {
    loadOraMetadata: (data) => ({ loadOraMetadata: data }),
    loadCourseMetadata: (data) => ({ loadCourseMetadata: data }),
  },
  submissions: {
    loadList: (data) => ({ loadList: data }),
  },
}));

describe('app thunkActions', () => {
  let dispatch;
  beforeEach(() => {
    dispatch = jest.fn((action) => ({ dispatch: action }));
  });
  describe('initialize', () => {
    beforeEach(() => {
      thunkActions.initialize()(dispatch);
    });
    test('it is called with location id from constants/app', () => {
      expect(api.initializeApp).toHaveBeenCalledWith(locationId);
    });
    describe('on success', () => {
      test('loads oraMetadata, courseMetadata and list data', () => {
        expect(dispatch.mock.calls).toEqual([
          [actions.app.loadOraMetadata(api.response.oraMetadata)],
          [actions.app.loadCourseMetadata(api.response.courseMetadata)],
          [actions.submissions.loadList(api.response.submissions)],
        ]);
      });
    });
  });
});
