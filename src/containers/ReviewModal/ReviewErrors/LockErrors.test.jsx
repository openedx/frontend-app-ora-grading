import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { IntlProvider } from '@edx/frontend-platform/i18n';
import { selectors } from 'data/redux';
import { ErrorStatuses, RequestKeys } from 'data/constants/requests';

import {
  LockErrors,
  mapStateToProps,
} from './LockErrors';

jest.unmock('react');
jest.unmock('@openedx/paragon');
jest.unmock('@edx/frontend-platform/i18n');

jest.mock('data/redux', () => ({
  selectors: {
    requests: {
      errorStatus: jest.fn(),
      isFailed: jest.fn(),
    },
  },
}));

const renderWithIntl = (component) => render(
  <IntlProvider locale="en">
    {component}
  </IntlProvider>,
);

describe('LockErrors component', () => {
  describe('when not failed', () => {
    it('renders nothing when isFailed is false', () => {
      const { container } = renderWithIntl(
        <LockErrors isFailed={false} />,
      );
      expect(container.firstChild).toBeNull();
    });
  });

  describe('when failed', () => {
    it('renders bad request error when errorStatus is badRequest', () => {
      renderWithIntl(
        <LockErrors
          isFailed
          errorStatus={ErrorStatuses.badRequest}
        />,
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
      const errorMessages = screen.getAllByText('Invalid request. Please check your input.');
      expect(errorMessages).toHaveLength(2);
    });

    it('renders conflict error when errorStatus is conflict', () => {
      renderWithIntl(
        <LockErrors
          isFailed
          errorStatus={ErrorStatuses.conflict}
        />,
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
      const errorMessages = screen.getAllByText('The lock owned by another user');
      expect(errorMessages).toHaveLength(2);
    });

    it('renders bad request error by default when no errorStatus provided', () => {
      renderWithIntl(
        <LockErrors isFailed />,
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
      const errorMessages = screen.getAllByText('Invalid request. Please check your input.');
      expect(errorMessages).toHaveLength(2);
    });
  });

  describe('mapStateToProps', () => {
    const testState = { some: 'test-state' };
    const requestKey = RequestKeys.setLock;

    beforeEach(() => {
      selectors.requests.isFailed.mockReturnValue(true);
      selectors.requests.errorStatus.mockReturnValue(ErrorStatuses.badRequest);
    });

    it('maps isFailed from requests selector', () => {
      const mapped = mapStateToProps(testState);

      expect(selectors.requests.isFailed).toHaveBeenCalledWith(testState, { requestKey });
      expect(mapped.isFailed).toBe(true);
    });

    it('maps errorStatus from requests selector', () => {
      const mapped = mapStateToProps(testState);

      expect(selectors.requests.errorStatus).toHaveBeenCalledWith(testState, { requestKey });
      expect(mapped.errorStatus).toBe(ErrorStatuses.badRequest);
    });
  });
});
