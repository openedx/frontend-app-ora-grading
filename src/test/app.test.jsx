import React from 'react';
import * as redux from 'redux';
import { Provider } from 'react-redux';
import {
  act,
  render,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import thunk from 'redux-thunk';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import urls from 'data/services/lms/urls';
import { ErrorStatuses, RequestKeys, RequestStates } from 'data/constants/requests';
import { lockStatuses } from 'data/services/lms/constants';
import fakeData from 'data/services/lms/fakeData';
import api from 'data/services/lms/api';
import reducers from 'data/redux';
import messages from 'i18n';

import App from 'App';
import appMessages from './messages';

jest.unmock('@edx/paragon');
jest.unmock('@edx/paragon/icons');
jest.unmock('@edx/frontend-platform/i18n');

jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedHttpClient: jest.fn(),
  getLoginRedirectUrl: jest.fn(),
}));

jest.mock('react-pdf', () => ({
  Document: () => <div>Document</div>,
  Image: () => <div>Image</div>,
  Page: () => <div>Page</div>,
  PDFViewer: jest.fn(() => null),
  StyleSheet: { create: () => {} },
  Text: () => <div>Text</div>,
  View: () => <div>View</div>,
  pdfjs: { GlobalWorkerOptions: {} },
}));
/*
jest.mock('react-pdf/node_modules/pdfjs-dist/build/pdf.worker.entry', () => (
  jest.requireActual('react-pdf/dist/umd/entry.jest')
));
*/
const configureStore = () => redux.createStore(
  reducers,
  redux.compose(redux.applyMiddleware(thunk)),
);

let el;
let store;
let state;

/**
 * Simple wrapper for updating the top-level state variable, that also returns the new value
 * @return {obj} - current redux store state
 */
const getState = () => {
  state = store.getState();
  return state;
};

/** Fake Data for quick access */
const submissionUUIDs = [
  fakeData.ids.submissionUUID(0),
  fakeData.ids.submissionUUID(1),
  fakeData.ids.submissionUUID(2),
  fakeData.ids.submissionUUID(3),
  fakeData.ids.submissionUUID(4),
];
const submissions = submissionUUIDs.map(id => fakeData.mockSubmission(id));
const statuses = submissionUUIDs.map(id => fakeData.mockSubmissionStatus(id));

const resolveFns = {};
/**
 * Mock the api with jest functions that can be tested against.
 */
const mockNetworkError = (reject) => () => reject(new Error({
  response: { status: ErrorStatuses.badRequest },
}));
const mockApi = () => {
  api.initializeApp = jest.fn(() => new Promise(
    (resolve, reject) => {
      resolveFns.init = {
        success: () => resolve({
          oraMetadata: fakeData.oraMetadata,
          courseMetadata: fakeData.courseMetadata,
          submissions: fakeData.submissions,
        }),
        networkError: mockNetworkError(reject),
      };
    },
  ));
  api.fetchSubmission = jest.fn((submissionUUID) => new Promise(
    (resolve, reject) => {
      resolveFns.fetch = {
        success: () => resolve(fakeData.mockSubmission(submissionUUID)),
        networkError: mockNetworkError(reject),
      };
    },
  ));
  api.fetchSubmissionStatus = jest.fn((submissionUUID) => new Promise(
    (resolve) => resolve(fakeData.mockSubmissionStatus(submissionUUID)),
  ));
  api.fetchSubmissionResponse = jest.fn((submissionUUID) => new Promise(
    (resolve) => resolve({ response: fakeData.mockSubmission(submissionUUID).response }),
  ));
  api.lockSubmission = jest.fn(() => new Promise(
    (resolve, reject) => {
      resolveFns.lock = {
        success: () => resolve({ lockStatus: lockStatuses.inProgress }),
        networkError: mockNetworkError(reject),
      };
    },
  ));
  api.unlockSubmission = jest.fn(() => new Promise(
    (resolve, reject) => {
      resolveFns.unlock = {
        success: () => resolve({ lockStatus: lockStatuses.unlocked }),
        networkError: mockNetworkError(reject),
      };
    },
  ));
};

/**
 * load and configure the store, render the element, and populate the top-level state object
 */
const renderEl = async () => {
  store = configureStore();
  el = await render(
    <IntlProvider locale="en" messages={messages.en}>
      <Provider store={store}>
        <App />
      </Provider>
    </IntlProvider>,
  );
  getState();
};

/**
 * resolve the initalization promise, and update state object
 */
const initialize = async () => {
  resolveFns.init.success();
  await act(() => el.findByText(fakeData.ids.username(0)));
  getState();
};

/**
 * Select the first 5 entries in the table and click the "View Selected Responses" button
 * Wait for the review page to show and update the top-level state object.
 */
const makeTableSelections = async () => {
  const table = el.getByRole('table');
  const rows = table.querySelectorAll('tbody tr');
  const checkbox = (index) => within(rows.item(index)).getByTitle('Toggle Row Selected');
  const clickIndex = (index) => userEvent.click(checkbox(index));
  [0, 1, 2, 3, 4].forEach(clickIndex);
  userEvent.click(el.container.querySelector('.view-selected-responses-btn'));
  // wait for navigation, which will show while request is pending
  await act(() => el.findByLabelText(appMessages.ReviewActionsComponents.loadPrevious));
  getState();
};

/**
 * Click the "next" button in review modal
 */
const clickNext = async () => {
  userEvent.click(el.getByLabelText('Load next submission'));
};

/**
 * Click the "next" button in review modal
 */
const clickPrev = async () => {
  userEvent.click(el.getByLabelText('Load previous submission'));
};

/**
 * Wait for neighbors, and then verify prev, current, and next grading fields have the appropriate
 * data.  Also ensure that the app is "grading" iff the "current" response's lockStatus is inProgress.
 */
const checkLoadedResponses = async (currentIndex) => {
  await waitFor(() => expect(getState().grading.current.submissionUUID).toEqual(submissionUUIDs[currentIndex]));
  const { lockStatus, gradeStatus } = statuses[currentIndex];
  expect(state.grading.current).toEqual({
    submissionUUID: submissionUUIDs[currentIndex],
    response: submissions[currentIndex].response,
    lockStatus,
    gradeStatus,
  });
  expect(state.app.showReview).toEqual(true);
};

const waitForEqual = async (valFn, expected) => waitFor(() => {
  expect(valFn()).toEqual(expected);
});
const waitForRequestStatus = (key, status) => waitForEqual(
  () => getState().requests[key].status,
  status,
);

const gradingStatus = ({ lockStatus, gradeStatus }) => (
  lockStatus === lockStatuses.unlocked ? gradeStatus : lockStatus
);
describe('ESG app integration tests', () => {
  test('initialState', async () => {
    mockApi();
    await renderEl();
    await waitForRequestStatus(RequestKeys.initialize, RequestStates.pending);
    const testInitialState = (key) => expect(state[key]).toEqual(
      jest.requireActual(`data/redux/${key}/reducer`).initialState,
    );
    testInitialState('app');
    testInitialState('submissions');
    testInitialState('grading');
    expect(el.getByText(appMessages.ListView.loadingResponses)).toBeVisible();

    // test network error
    resolveFns.init.networkError();
    await waitForRequestStatus(RequestKeys.initialize, RequestStates.failed);
    expect(await el.findByText(appMessages.ListView.loadErrorHeading)).toBeVisible();
    const backLink = el.getByText(appMessages.ListView.backToResponsesLowercase).closest('a');
    expect(backLink.href).toEqual(urls.openResponse(getState().app.courseMetadata.courseId));
    const retryLink = el.getByText(appMessages.ListView.reloadSubmissions).closest('button');

    // retry and set back to pending state
    await userEvent.click(retryLink);
    await waitForRequestStatus(RequestKeys.initialize, RequestStates.pending);

    // succeed this time
    await initialize();
    await waitForRequestStatus(RequestKeys.initialize, RequestStates.completed);
    expect(state.app.courseMetadata).toEqual(fakeData.courseMetadata);
    expect(state.app.oraMetadata).toEqual(fakeData.oraMetadata);
    expect(state.submissions.allSubmissions).toEqual(fakeData.submissions);
  });

  test('review', async () => {
    await renderEl();
    await initialize();
    await makeTableSelections();

    // fetch: Pending
    await waitForRequestStatus(RequestKeys.fetchSubmission, RequestStates.pending);
    expect(state.grading.selected).toEqual(submissionUUIDs);
    // fetch pending: displays FullscreenModal
    expect(await el.findByRole('dialog')).toBeVisible();
    // fetch pending: displays loading display
    let modal = within(el.getByRole('dialog'));
    // fetch pending: display username
    expect(modal.getByText(fakeData.ids.username(0))).toBeVisible();
    // fetch pending: displays navigation, with both buttons disabled
    const { loadPrevious, loadNext } = appMessages.ReviewActionsComponents;
    let nextNav = modal.getByLabelText(loadNext);
    let prevNav = modal.getByLabelText(loadPrevious);
    expect(nextNav).toBeVisible();
    expect(nextNav).toHaveAttribute('disabled');
    expect(prevNav).toBeVisible();
    expect(prevNav).toHaveAttribute('disabled');
    // fetch pending: displays loading text
    expect(modal.getByText(appMessages.ReviewModal.loadingResponse)).toBeVisible();

    // fetch: Network Error
    await resolveFns.fetch.networkError();
    await waitForRequestStatus(RequestKeys.fetchSubmission, RequestStates.failed);
    expect(await el.findByText(appMessages.ReviewErrors.loadErrorHeading)).toBeVisible();

    // fetch: retry and succeed
    const retryLink = el.getByText(appMessages.ReviewErrors.reloadSubmission).closest('button');
    await userEvent.click(retryLink);
    await waitForRequestStatus(RequestKeys.fetchSubmission, RequestStates.pending);

    // fetch: success
    let showRubric = false;
    const verifyFetchSuccess = async (submissionIndex) => {
      const submission = submissions[submissionIndex];
      await resolveFns.fetch.success();
      await waitForRequestStatus(RequestKeys.fetchSubmission, RequestStates.completed);
      modal = within(el.getByRole('dialog'));
      // displays submission status badge
      expect(
        modal.getByText(appMessages.lms[gradingStatus(submission)]),
      ).toBeVisible();
      // loads selected submission ids
      // app flags, { showReview: true, isGrading: false, showRubric: false }
      expect(state.app.showReview).toEqual(true);
      if (submission.lockStatus === lockStatuses.inProgress) {
        showRubric = true;
      }
      expect(state.app.showRubric).toEqual(showRubric);
      if (showRubric) {
        expect(el.getByText(appMessages.ReviewActions.hideRubric)).toBeVisible();
      } else {
        expect(el.getByText(appMessages.ReviewActions.showRubric)).toBeVisible();
      }

      // loads current submission
      expect(state.grading.current).toEqual({
        submissionUUID: submissionUUIDs[submissionIndex],
        ...submissions[submissionIndex],
      });
      nextNav = modal.getByLabelText(loadNext);
      prevNav = modal.getByLabelText(loadPrevious);
      expect(nextNav).toBeVisible();
      expect(prevNav).toBeVisible();
      if (submissionIndex > 0) {
        expect(prevNav).not.toHaveAttribute('disabled');
      } else {
        expect(prevNav).toHaveAttribute('disabled');
      }
      if (submissionIndex < submissions.length - 1) {
        expect(nextNav).not.toHaveAttribute('disabled');
      } else {
        expect(nextNav).toHaveAttribute('disabled');
      }
    };
    await verifyFetchSuccess(0);

    await clickNext();
    await verifyFetchSuccess(1);

    await clickNext();
    await verifyFetchSuccess(2);

    await clickNext();
    await verifyFetchSuccess(3);

    await clickNext();
    await verifyFetchSuccess(4);

    await clickPrev();
    await verifyFetchSuccess(3);

    await clickPrev();
    await verifyFetchSuccess(2);

    await clickPrev();
    await verifyFetchSuccess(1);

    await clickPrev();
    await verifyFetchSuccess(0);
  });
});
