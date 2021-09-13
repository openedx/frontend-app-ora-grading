import { StrictDict } from 'utils';
import fakeData from './fakeData';

// import urls from './urls';
// import { pageSize, paramKeys } from './constants';
// import messages from './messages';
// import * as utils from './utils';
// const { get, post, stringifyUrl } = utils;

/*********************************************************************************
 * GET Actions
 *********************************************************************************/

const mockGet = (returnValFn) => (...args) => (
  new Promise((resolve) => resolve(returnValFn(...args)))
);

// eslint-disable-next-line no-unused-vars
const initializeApp = mockGet(() => ({
  oraMetadata: fakeData.oraMetadata,
  submissions: fakeData.submissions,
}));

const fetchSubmission = mockGet((learnerId) => ({
  submission: fakeData.mockSubmission(learnerId),
}));

const fetchSubmissionStatus = mockGet((learnerId) => ({
  status: fakeData.mockSubmission(learnerId).status,
}));

export default StrictDict({
  initializeApp,
  fetchSubmission,
  fetchSubmissionStatus,
});
