import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { thunkActions } from 'data/redux';
import { renderWithIntl } from '../../../testUtils';

import {
  SubmissionNavigation,
  mapDispatchToProps,
} from './SubmissionNavigation';

describe('SubmissionNavigation component', () => {
  describe('component', () => {
    const defaultProps = {
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
      expect(screen.getByText(`${defaultProps.activeIndex + 1} of ${defaultProps.selectionLength}`)).toBeInTheDocument();
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

    it('calls loadPrev when previous button is clicked', async () => {
      renderWithIntl(<SubmissionNavigation {...defaultProps} />);
      const prevButton = screen.getByRole('button', { name: /load previous submission/i });
      const user = userEvent.setup();
      await user.click(prevButton);
      expect(defaultProps.loadPrev).toHaveBeenCalledTimes(1);
    });

    it('calls loadNext when next button is clicked', async () => {
      renderWithIntl(<SubmissionNavigation {...defaultProps} />);
      const nextButton = screen.getByRole('button', { name: /load next submission/i });
      const user = userEvent.setup();
      await user.click(nextButton);
      expect(defaultProps.loadNext).toHaveBeenCalledTimes(1);
    });

    it('shows correct position when at first submission', () => {
      renderWithIntl(
        <SubmissionNavigation {...defaultProps} activeIndex={0} hasPrevSubmission={false} />,
      );
      expect(screen.getByText(`${1} of ${defaultProps.selectionLength}`)).toBeInTheDocument();
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
