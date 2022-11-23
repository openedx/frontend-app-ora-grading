import { StrictDict, keyStore } from 'utils';
import { locationId } from 'data/constants/app';
import { paramKeys } from './constants';
import urls from './urls';
import api from './api';
import { stringifyUrl } from './utils';

jest.mock('./utils', () => ({
  client: () => ({ delete: (url) => Promise.resolve({ data: { delete: { url } } }) }),
  get: (url) => Promise.resolve({ data: { get: { url } } }),
  post: (url, data) => Promise.resolve({ data: { post: { url, data } } }),
  stringifyUrl: args => ({ stringifyUrl: args }),
}));

const gradeData = 'test-grade-data';
const submissionUUID = 'test-submission-uuid';
const submissionUUIDs = ['some', 'submission', 'uuid'];

const methodKeys = StrictDict({
  get: 'get',
  post: 'post',
  delete: 'delete',
});

const urlKeys = keyStore(urls);

const testAPI = ({
  promise,
  method,
  expected: {
    urlKey,
    urlParams,
    ...otherExpected
  },
}) => {
  it(`returns ${method}(${urlKey}) with correct args and reoslves with response data`, () => (
    promise.then((data) => {
      expect(data[method]).toEqual({
        url: stringifyUrl(urls[urlKey], urlParams),
        ...otherExpected,
      });
    })
  ));
};

describe('lms service api methods', () => {
  describe('initializeApp', () => {
    testAPI({
      promise: api.initializeApp(),
      method: methodKeys.get,
      expected: {
        urlKey: urlKeys.oraInitializeUrl,
        urlParams: { [paramKeys.oraLocation]: locationId },
      },
    });
  });
  describe('fetchSubmission', () => {
    testAPI({
      promise: api.fetchSubmission(submissionUUID),
      method: methodKeys.get,
      expected: {
        urlKey: urlKeys.fetchSubmissionUrl,
        urlParams: {
          [paramKeys.oraLocation]: locationId,
          [paramKeys.submissionUUID]: submissionUUID,
        },
      },
    });
  });
  describe('fetchSubmissionFiles', () => {
    testAPI({
      promise: api.fetchSubmissionFiles(submissionUUID),
      method: methodKeys.get,
      expected: {
        urlKey: urlKeys.fetchSubmissionFilesUrl,
        urlParams: {
          [paramKeys.oraLocation]: locationId,
          [paramKeys.submissionUUID]: submissionUUID,
        },
      },
    });
  });
  describe('fetchSubmissionStatus', () => {
    testAPI({
      promise: api.fetchSubmissionStatus(submissionUUID),
      method: methodKeys.get,
      expected: {
        urlKey: urlKeys.fetchSubmissionStatusUrl,
        urlParams: {
          [paramKeys.oraLocation]: locationId,
          [paramKeys.submissionUUID]: submissionUUID,
        },
      },
    });
  });
  describe('lockSubmission', () => {
    testAPI({
      promise: api.lockSubmission(submissionUUID),
      method: methodKeys.post,
      expected: {
        urlKey: urlKeys.fetchSubmissionLockUrl,
        urlParams: {
          [paramKeys.oraLocation]: locationId,
          [paramKeys.submissionUUID]: submissionUUID,
        },
      },
    });
  });
  describe('unlockSubmission', () => {
    testAPI({
      promise: api.unlockSubmission(submissionUUID),
      method: methodKeys.delete,
      expected: {
        urlKey: urlKeys.fetchSubmissionLockUrl,
        urlParams: {
          [paramKeys.oraLocation]: locationId,
          [paramKeys.submissionUUID]: submissionUUID,
        },
      },
    });
  });
  describe('batchUnlockSubmissions', () => {
    testAPI({
      promise: api.batchUnlockSubmissions(submissionUUIDs),
      method: methodKeys.post,
      expected: {
        urlKey: urlKeys.batchUnlockSubmissionsUrl,
        urlParams: {
          [paramKeys.oraLocation]: locationId,
        },
        data: { submissionUUIDs },
      },
    });
  });
  describe('updateGrade', () => {
    testAPI({
      promise: api.updateGrade(submissionUUID, gradeData),
      method: methodKeys.post,
      expected: {
        urlKey: urlKeys.updateSubmissionGradeUrl,
        urlParams: {
          [paramKeys.oraLocation]: locationId,
          [paramKeys.submissionUUID]: submissionUUID,
        },
        data: gradeData,
      },
    });
  });
});
