import { render, screen } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { selectors, thunkActions } from 'data/redux';
import { gradingStatuses as statuses } from 'data/services/lms/constants';
import StatusBadge from 'components/StatusBadge';
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
      pointsEarned: 2,
      pointsPossible: 10,
    },
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
    intl: {
      formatMessage: jest.fn((message) => message.defaultMessage),
    },
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
      const component = new SubmissionsTable(defaultProps);
      const fakeDate = 1613121515495;
      const result = component.formatDate({ value: fakeDate });
      expect(typeof result).toBe('string');
    });

    it('formats grade as dash when null', () => {
      const component = new SubmissionsTable(defaultProps);
      const result = component.formatGrade({ value: null });
      expect(result).toBe('-');
    });

    it('formats grade as points earned over points possible', () => {
      const component = new SubmissionsTable(defaultProps);
      const result = component.formatGrade({ value: { pointsEarned: 5, pointsPossible: 10 } });
      expect(result).toBe('5/10');
    });

    it('formats status as StatusBadge component', () => {
      const component = new SubmissionsTable(defaultProps);
      const result = component.formatStatus({ value: 'graded' });
      expect(result).toEqual(<StatusBadge status="graded" />);
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
