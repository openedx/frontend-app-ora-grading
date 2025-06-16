import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import { thunkActions } from 'data/redux';

import {
  SubmissionNavigation,
  mapDispatchToProps,
} from './SubmissionNavigation';

jest.unmock('@openedx/paragon');
jest.unmock('react');

const mockMessages = {
  'ora-grading.ReviewActions.loadPrevious': 'Load previous submission',
  'ora-grading.ReviewActions.loadNext': 'Load next submission',
  'ora-grading.ReviewActions.navigationLabel': '{current} of {total}',
};

const mockIntl = {
  formatMessage: (message, values = {}) => {
    let text = message.defaultMessage || message.id;
    Object.keys(values).forEach(key => {
      text = text.replace(`{${key}}`, values[key]);
    });
    return text;
  },
};

const renderWithIntl = (component) => render(
  <IntlProvider locale="en" messages={mockMessages}>
    {component}
  </IntlProvider>,
);

describe('SubmissionNavigation component', () => {
  describe('component', () => {
    const defaultProps = {
      intl: mockIntl,
      activeIndex: 4,
      selectionLength: 5,
      loadNext: jest.fn(),
      loadPrev: jest.fn(),
      hasPrevSubmission: true,
      hasNextSubmission: true,
      allowNavigation: true,
    };

    beforeEach(() => {
      defaultProps.loadNext.mockClear();
      defaultProps.loadPrev.mockClear();
    });

    it('renders navigation with current position and total submissions', () => {
      renderWithIntl(<SubmissionNavigation {...defaultProps} />);
      expect(screen.getByText('FormattedMessage')).toBeInTheDocument();
    });

    it('disables previous button when no previous submission exists', () => {
      renderWithIntl(
        <SubmissionNavigation {...defaultProps} hasPrevSubmission={false} />,
      );
      const prevButton = screen.getByRole('button', { name: /load previous submission/i });
      expect(prevButton).toBeDisabled();
    });

    it('disables next button when no next submission exists', () => {
      renderWithIntl(
        <SubmissionNavigation {...defaultProps} hasNextSubmission={false} />,
      );
      const nextButton = screen.getByRole('button', { name: /load next submission/i });
      expect(nextButton).toBeDisabled();
    });

    it('disables both buttons when navigation is not allowed', () => {
      renderWithIntl(
        <SubmissionNavigation {...defaultProps} allowNavigation={false} />,
      );
      const prevButton = screen.getByRole('button', { name: /load previous submission/i });
      const nextButton = screen.getByRole('button', { name: /load next submission/i });
      expect(prevButton).toBeDisabled();
      expect(nextButton).toBeDisabled();
    });

    it('calls loadPrev when previous button is clicked', () => {
      renderWithIntl(<SubmissionNavigation {...defaultProps} />);
      const prevButton = screen.getByRole('button', { name: /load previous submission/i });
      fireEvent.click(prevButton);
      expect(defaultProps.loadPrev).toHaveBeenCalledTimes(1);
    });

    it('calls loadNext when next button is clicked', () => {
      render(<SubmissionNavigation {...defaultProps} />);
      const nextButton = screen.getByRole('button', { name: /load next submission/i });
      fireEvent.click(nextButton);
      expect(defaultProps.loadNext).toHaveBeenCalledTimes(1);
    });

    it('shows correct position when at first submission', () => {
      render(
        <SubmissionNavigation {...defaultProps} activeIndex={0} hasPrevSubmission={false} />,
      );
      expect(screen.getByText('FormattedMessage')).toBeInTheDocument();
    });
  });

  describe('mapDispatchToProps', () => {
    it('loads loadNext from thunk actions', () => {
      expect(mapDispatchToProps.loadNext).toEqual(thunkActions.grading.loadNext);
    });

    it('loads loadPrev from thunk actions', () => {
      expect(mapDispatchToProps.loadPrev).toEqual(thunkActions.grading.loadPrev);
    });
  });
});
