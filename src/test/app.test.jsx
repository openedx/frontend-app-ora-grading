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

import fakeData from 'data/services/lms/fakeData';
import api from 'data/services/lms/api';
import reducers from 'data/redux';
import messages from 'i18n';
import reviewActionsMessages from 'containers/ReviewActions/messages';

import App from 'App';

jest.unmock('@edx/paragon');
jest.unmock('@edx/paragon/icons');
jest.unmock('@edx/frontend-platform/i18n');

jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedHttpClient: jest.fn(),
  getLoginRedirectUrl: jest.fn(),
}));

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
const mockApi = () => {
  api.initializeApp = jest.fn(() => new Promise(
    (resolve) => {
      resolveFns.initialize = () => resolve({
        oraMetadata: fakeData.oraMetadata,
        courseMetadata: fakeData.courseMetadata,
        submissions: fakeData.submissions,
      });
    },
  ));
  api.fetchSubmission = jest.fn((submissionUUID) => new Promise(
    (resolve) => resolve(fakeData.mockSubmission(submissionUUID)),
  ));
  api.fetchSubmissionStatus = jest.fn((submissionUUID) => new Promise(
    (resolve) => resolve(fakeData.mockSubmissionStatus(submissionUUID)),
  ));
  api.fetchSubmissionResponse = jest.fn((submissionUUID) => new Promise(
    (resolve) => resolve({ response: fakeData.mockSubmission(submissionUUID).response }),
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
  resolveFns.initialize();
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
  await act(() => el.findByText(reviewActionsMessages.showRubric.defaultMessage));
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

describe('ESG app integration tests', () => {
  beforeAll(() => mockApi());

  test('initialState', async () => {
    await renderEl();
    expect(state.app).toEqual(
      jest.requireActual('data/redux/app/reducer').initialState,
    );
    expect(state.submissions).toEqual(
      jest.requireActual('data/redux/submissions/reducer').initialState,
    );
    expect(state.grading).toEqual(
      jest.requireActual('data/redux/grading/reducer').initialState,
    );
  });

  test('initialization', async () => {
    await renderEl();
    await initialize();
    expect(state.app.courseMetadata).toEqual(fakeData.courseMetadata);
    expect(state.app.oraMetadata).toEqual(fakeData.oraMetadata);
    expect(state.submissions.allSubmissions).toEqual(fakeData.submissions);
  });

  describe('table selection', () => {
    beforeAll(async () => {
      await renderEl();
      await initialize();
      await makeTableSelections();
    });
    it('loads selected submission ids', () => {
      expect(state.grading.selected).toEqual(submissionUUIDs);
    });
    test('app flags, { showReview: true, isGrading: false, showRubric: false }', () => {
      expect(state.app.showReview).toEqual(true);
      expect(state.app.showRubric).toEqual(false);
    });
    it('loads current submission', () => {
      const submissionUUID = fakeData.ids.submissionUUID(0);
      expect(state.grading.current).toEqual({
        submissionUUID,
        ...fakeData.mockSubmission(submissionUUID),
      });
    });
  });

  describe('review navigation', () => {
    test('loads full submission for current, and response for neighbors when navigating', async () => {
      await renderEl();
      await initialize();
      await makeTableSelections();
      await clickNext();
      await checkLoadedResponses(1);
      await clickNext();
      await checkLoadedResponses(2);
      await clickPrev();
      await checkLoadedResponses(1);
      await clickNext();
      await checkLoadedResponses(2);
      await clickNext();
      await checkLoadedResponses(3);
      await clickNext();
      await checkLoadedResponses(4);
      await clickPrev();
      await checkLoadedResponses(3);
      await clickPrev();
      await checkLoadedResponses(2);
      await clickPrev();
      await checkLoadedResponses(1);
      await clickPrev();
      await checkLoadedResponses(0);
    });
  });
});
