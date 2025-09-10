import React from 'react';
import { screen } from '@testing-library/react';

import { selectors, thunkActions } from 'data/redux';
import { RequestKeys } from 'data/constants/requests';
import { renderWithIntl } from '../../../testUtils';
import {
  FetchErrors,
  mapStateToProps,
  mapDispatchToProps,
} from './FetchErrors';

jest.mock('data/redux', () => ({
  selectors: {
    requests: {
      isFailed: (...args) => ({ isFailed: args }),
    },
  },
  thunkActions: {
    grading: {
      loadSubmission: jest.fn(),
    },
  },
}));

const requestKey = RequestKeys.fetchSubmission;

describe('FetchErrors component', () => {
  const props = {
    isFailed: false,
    reload: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render when isFailed is false', () => {
    const { container } = renderWithIntl(<FetchErrors {...props} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders error message when isFailed is true', () => {
    renderWithIntl(<FetchErrors {...props} isFailed />);
    expect(screen.getByText('Error loading submissions')).toBeInTheDocument();
    expect(screen.getByText('An error occurred while loading this submission. Try reloading this submission.')).toBeInTheDocument();
  });

  it('renders reload button when error occurs', () => {
    renderWithIntl(<FetchErrors {...props} isFailed />);
    expect(screen.getByText('Reload submission')).toBeInTheDocument();
  });

  describe('mapStateToProps', () => {
    const testState = { some: 'test-state' };

    it('maps isFailed from requests selector', () => {
      const mapped = mapStateToProps(testState);
      expect(mapped.isFailed).toEqual(selectors.requests.isFailed(testState, { requestKey }));
    });
  });

  describe('mapDispatchToProps', () => {
    it('maps reload from thunkActions.grading.loadSubmission', () => {
      expect(mapDispatchToProps.reload).toEqual(thunkActions.grading.loadSubmission);
    });
  });
});
