/* eslint-disable */
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
import { selectors } from 'data/redux';

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
let retryLink;
let find;
let get;



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
    <IntlProvider locale='en' messages={messages.en}>
      <Provider store={store}>
        <App />
      </Provider>
    </IntlProvider>,
  );
  getState();
};

class Inspector {
  listTable = () => el.getByRole('table');
  modal = () => el.getByRole('dialog');
  modalEl = () => within(this.modal());

  listTable = () => el.getByRole('table');
  listTableRows = () => this.listTable().querySelectorAll('tbody tr');
  listCheckbox = (index) => within(this.listTableRows().item(index)).getByTitle('Toggle Row Selected');
  listViewSelectedBtn = () => el.getByText('View selected responses (5)');
  nextNav = () => el.getByLabelText(appMessages.ReviewActionsComponents.loadNext);
  prevNav = () => el.getByLabelText(appMessages.ReviewActionsComponents.loadPrevious);
  reviewUsername = (index) => this.modalEl().getByText(fakeData.ids.username(index));
  reviewLoadingResponse = () => this.modalEl().getByText(appMessages.ReviewModal.loadingResponse);
  reviewRetryLink = () => (
    el.getByText(appMessages.ReviewErrors.reloadSubmission).closest('button')
  );
  reviewGradingStatus = (submission) => (
    this.modalEl().getByText(appMessages.lms[gradingStatus(submission)])
  );
}
class Finder {
  listViewAllResponsesBtn = () => el.findByText(appMessages.ListView.viewAllResponses);
  listLoadErrorHeading = () => el.findByText(appMessages.ListView.loadErrorHeading);
  prevNav = () => get.modalEl().findByLabelText(appMessages.ReviewActionsComponents.loadPrevious);
  reviewLoadErrorHeading = () => el.findByText(appMessages.ReviewErrors.loadErrorHeading);
}


/**
 * resolve the initalization promise, and update state object
 */
const initialize = async () => {
  resolveFns.init.success();
  await find.listViewAllResponsesBtn();
  getState();
};

/**
 * Select the first 5 entries in the table and click the 'View Selected Responses' button
 * Wait for the review page to show and update the top-level state object.
 */
const makeTableSelections = async () => {
  [0, 1, 2, 3, 4].forEach(index => userEvent.click(get.listCheckbox(index)));
  userEvent.click(get.listViewSelectedBtn());
  // wait for navigation, which will show while request is pending
  try {
    await find.prevNav();
  } catch (e) {
    throw(e);
  }
  getState();
};

// Click the 'next' button in review modal
const clickNext = async () => { userEvent.click(get.nextNav()); };

// Click the 'next' button in review modal
const clickPrev = async () => { userEvent.click(get.prevNav()); };

const waitForEqual = async (valFn, expected, key) => waitFor(() => {
  expect(valFn(), `${key} is expected to equal ${expected}`).toEqual(expected);
});
const waitForRequestStatus = (key, status) => waitForEqual(
  () => getState().requests[key].status,
  status,
  key,
);

const gradingStatus = ({ lockStatus, gradeStatus }) => (
  lockStatus === lockStatuses.unlocked ? gradeStatus : lockStatus
);
describe('ESG app integration tests', () => {
  test('initialState', async () => {
    mockApi();
    await renderEl();
    get = new Inspector();
    find = new Finder();
    await waitForRequestStatus(RequestKeys.initialize, RequestStates.pending);
    const testInitialState = (key) => expect(
      state[key],
      `${key} store should have its configured initial state`,
    ).toEqual(
      jest.requireActual(`data/redux/${key}/reducer`).initialState,
    );
    testInitialState('app');
    testInitialState('submissions');
    testInitialState('grading');
    expect(
      el.getByText(appMessages.ListView.loadingResponses),
      'Loading Responses pending state text should be displayed in the ListView',
    ).toBeVisible();

    // initialization network error
    resolveFns.init.networkError();
    await waitForRequestStatus(RequestKeys.initialize, RequestStates.failed);
    expect(
      await find.listLoadErrorHeading(),
      'List Error should be available (by heading component)',
    ).toBeVisible();
    const backLink = el.getByText(appMessages.ListView.backToResponsesLowercase).closest('a');
    expect(
      backLink.href,
      'Back to responses button href should link to urls.openResponse(courseId)',
    ).toEqual(urls.openResponse(getState().app.courseMetadata.courseId));
    retryLink = el.getByText(appMessages.ListView.reloadSubmissions).closest('button');

    // initialization retry/pending
    await userEvent.click(retryLink);
    await waitForRequestStatus(RequestKeys.initialize, RequestStates.pending);

    // initialization success
    await initialize();
    await waitForRequestStatus(RequestKeys.initialize, RequestStates.completed);
    expect(
      state.app.courseMetadata,
      'Course metadata in redux should be populated with fake data',
    ).toEqual(fakeData.courseMetadata);
    expect(
      state.app.oraMetadata,
      'ORA metadata in redux should be populated with fake data',
    ).toEqual(fakeData.oraMetadata);
    expect(
      state.submissions.allSubmissions,
      'submissions data in redux should be populated with fake data',
    ).toEqual(fakeData.submissions);

    // Table selection
    await makeTableSelections();

    // Review pending
    await waitForRequestStatus(RequestKeys.fetchSubmission, RequestStates.pending);
    expect(
      state.grading.selected,
      'submission IDs should be loaded',
    ).toEqual(submissionUUIDs);
    // expect(get.modal(), 'ReviewModal should be visible').toBeVisible();
    expect(state.app.showReview, 'app store should have showReview: true').toEqual(true);
    expect(get.reviewUsername(0), 'username should be visible').toBeVisible();
    expect(get.nextNav(), 'next nav should be displayed').toBeVisible();
    expect(get.nextNav(), 'next nav should be disabled').toHaveAttribute('disabled');
    expect(get.prevNav(), 'prev nav should be displayed').toBeVisible();
    expect(get.prevNav(), 'prev nav should be disabled').toHaveAttribute('disabled');
    expect(
      get.reviewLoadingResponse(),
      'Loading Responses pending state text should be displayed in the ReviewModal',
    ).toBeVisible();

    // Review: Fetch - Network Error
    await resolveFns.fetch.networkError();
    await waitForRequestStatus(RequestKeys.fetchSubmission, RequestStates.failed);
    expect(
      await find.reviewLoadErrorHeading(),
      'Load Submission error should be displayed in ReviewModal',
    ).toBeVisible();
    
    // fetch: retry and succeed
    await userEvent.click(get.reviewRetryLink());
    await waitForRequestStatus(RequestKeys.fetchSubmission, RequestStates.pending);

    let showRubric = false;
    // fetch: success
    const verifyFetchSuccess = async (submissionIndex) => {
      const submissionString = `for submission ${submissionIndex}`;
      const submission = submissions[submissionIndex];
      await resolveFns.fetch.success();

      await waitForRequestStatus(RequestKeys.fetchSubmission, RequestStates.completed);
      expect(
        get.reviewGradingStatus(submission),
        `Should display current submission grading status ${submissionString}`,
      ).toBeVisible();

      showRubric = showRubric || selectors.grading.selected.isGrading(getState());
      getState();
      expect(
        state.app.showRubric,
        `${showRubric ? 'Should' : 'Should not'} show rubric ${submissionString}`,
      ).toEqual(showRubric);
      if (showRubric) {
        expect(
          el.getByText(appMessages.ReviewActions.hideRubric),
          `Hide Rubric button should be visible when rubric is shown ${submissionString}`,
        ).toBeVisible();

      } else {
        expect(
          el.getByText(appMessages.ReviewActions.showRubric),
          `Show Rubric button should be visible when rubric is hidden ${submissionString}`,
        ).toBeVisible();
      }

      // loads current submission
      expect(
        state.grading.current,
        `Redux current grading state should load the current submission ${submissionString}`,
      ).toEqual({
        submissionUUID: submissionUUIDs[submissionIndex],
        ...submissions[submissionIndex],
      });
      expect(get.nextNav(), `Next nav should be visible ${submissionString}`).toBeVisible();
      expect(get.prevNav(), `Prev nav should be visible ${submissionString}`).toBeVisible();

      if (submissionIndex > 0) {
        expect(
          get.prevNav(),
          `Prev nav should be enabled ${submissionString}`,
        ).not.toHaveAttribute('disabled');
      } else {
        expect(
          get.prevNav(),
          `Prev nav should be disabled ${submissionString}`,
        ).toHaveAttribute('disabled');
      }
      if (submissionIndex < submissions.length - 1) {
        expect(
          get.nextNav(),
          `Next nav should be enabled ${submissionString}`,
        ).not.toHaveAttribute('disabled');
      } else {
        expect(
          get.nextNav(),
          `Next nav should be disabled ${submissionString}`,
        ).toHaveAttribute('disabled');
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

    await clickNext();
    await verifyFetchSuccess(4);

    await clickPrev();
    await verifyFetchSuccess(3);

    await clickPrev();
    await verifyFetchSuccess(2, true);

    await clickPrev();
    await verifyFetchSuccess(1);

    await clickPrev();
    await verifyFetchSuccess(0);
    done();
  });
});
