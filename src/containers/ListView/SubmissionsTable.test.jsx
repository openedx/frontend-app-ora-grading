import { render, screen } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { selectors, thunkActions } from 'data/redux';
import { gradingStatuses as statuses } from 'data/services/lms/constants';
import {
  SubmissionsTable,
  mapStateToProps,
  mapDispatchToProps,
} from './SubmissionsTable';

jest.unmock('@openedx/paragon');
jest.unmock('react');
jest.unmock('@edx/frontend-platform/i18n');

jest.mock('data/redux', () => ({
  selectors: {
    app: {
      ora: {
        isIndividual: jest.fn((state) => state.isIndividual || true),
      },
    },
    submissions: {
      listData: jest.fn((state) => state.listData || []),
    },
  },
  thunkActions: {
    grading: {
      loadSelectionForReview: jest.fn(),
    },
  },
}));

const dates = [
  '2021-12-08 09:06:15.319213+00:00',
  '2021-12-10 18:06:15.319213+00:00',
  '2021-12-11 07:06:15.319213+00:00',
];

const individualData = [
  {
    username: 'username-1',
    dateSubmitted: dates[0],
    gradingStatus: statuses.ungraded,
    score: {
      pointsEarned: 1,
      pointsPossible: 10,
    },
  },
  {
    username: 'username-2',
    dateSubmitted: dates[1],
    gradingStatus: statuses.graded,
    score: {
      pointsEarned: 9,
      pointsPossible: 10,
    },
  },
  {
    username: 'username-2',
    dateSubmitted: dates[1],
    gradingStatus: statuses.ungraded,
    score: null,
  },
];

const teamData = [
  {
    teamName: 'teamName-1',
    dateSubmitted: dates[0],
    gradingStatus: statuses.ungraded,
    score: {
      pointsEarned: 1,
      pointsPossible: 10,
    },
  },
  {
    teamName: 'teamName-2',
    dateSubmitted: dates[1],
    gradingStatus: statuses.graded,
    score: {
      pointsEarned: 2,
      pointsPossible: 10,
    },
  },
];

describe('SubmissionsTable component', () => {
  const defaultProps = {
    isIndividual: true,
    listData: [...individualData],
    loadSelectionForReview: jest.fn(),
  };

  const renderWithIntl = (component) => render(
    <IntlProvider locale="en" messages={{}}>
      {component}
    </IntlProvider>,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('behavior', () => {
    it('renders DataTable component', () => {
      const { container } = renderWithIntl(<SubmissionsTable {...defaultProps} />);
      const submissionsTable = container.querySelector('.submissions-table');
      expect(submissionsTable).toBeInTheDocument();
    });

    it('returns empty render when no list data provided', () => {
      const { container } = renderWithIntl(<SubmissionsTable {...defaultProps} listData={[]} />);
      expect(container.firstChild).toBeNull();
    });

    it('renders individual columns for individual submissions', () => {
      renderWithIntl(<SubmissionsTable {...defaultProps} />);
      expect(screen.getByText('Username')).toBeInTheDocument();
      expect(screen.getByText('Learner submission date')).toBeInTheDocument();
    });

    it('renders team columns for team submissions', () => {
      renderWithIntl(<SubmissionsTable {...defaultProps} isIndividual={false} listData={teamData} />);
      expect(screen.getByText('Team name')).toBeInTheDocument();
      expect(screen.getByText('Team submission date')).toBeInTheDocument();
    });

    it('formats date correctly', () => {
      renderWithIntl(<SubmissionsTable {...defaultProps} />);
      const formattedDate = screen.getAllByText('12/10/2021, 6:06:15 PM');
      expect(formattedDate.length).toBeGreaterThan(0);
    });

    it('formats grade as dash when null', () => {
      renderWithIntl(<SubmissionsTable {...defaultProps} />);
      const noScore = screen.getByText('-');
      expect(noScore).toBeInTheDocument();
    });

    it('formats grade as points earned over points possible', () => {
      renderWithIntl(<SubmissionsTable {...defaultProps} />);
      const scored = screen.getByText('9/10');
      expect(scored).toBeInTheDocument();
    });

    it('formats status as StatusBadge component', () => {
      renderWithIntl(<SubmissionsTable {...defaultProps} />);
      screen.debug();
      const gradedBadge = screen.getByText('Grading Completed');
      expect(gradedBadge).toHaveClass('badge-success');
      const ungradedBadge = screen.getAllByText('Ungraded')[0];
      expect(ungradedBadge).toHaveClass('badge-primary');
    });
  });

  describe('mapStateToProps', () => {
    const testState = { some: 'test-state' };

    it('maps listData from submissions.listData selector', () => {
      const mapped = mapStateToProps(testState);
      expect(mapped.listData).toEqual(selectors.submissions.listData(testState));
    });

    it('maps isIndividual from app.ora.isIndividual selector', () => {
      const mapped = mapStateToProps(testState);
      expect(mapped.isIndividual).toEqual(selectors.app.ora.isIndividual(testState));
    });
  });

  describe('mapDispatchToProps', () => {
    it('maps loadSelectionForReview from thunkActions', () => {
      expect(mapDispatchToProps.loadSelectionForReview).toEqual(thunkActions.grading.loadSelectionForReview);
    });
  });
});
