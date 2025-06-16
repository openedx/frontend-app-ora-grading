import { render, fireEvent } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { actions, selectors } from 'data/redux';
import { RequestKeys } from 'data/constants/requests';
import { ReviewActions, mapStateToProps, mapDispatchToProps } from '.';

jest.unmock('@openedx/paragon');
jest.unmock('react');
jest.unmock('@edx/frontend-platform/i18n');

jest.mock('data/redux', () => ({
  actions: {
    app: {
      toggleShowRubric: jest.fn().mockName('actions.app.toggleShowRubric'),
    },
  },
  selectors: {
    app: {
      showRubric: jest.fn(state => state.showRubric).mockName('selectors.app.showRubric'),
    },
    grading: {
      selected: {
        userDisplay: jest.fn(state => state.userDisplay).mockName('selectors.grading.selected.userDisplay'),
        gradingStatus: jest.fn(state => state.gradingStatus).mockName('selectors.grading.selected.gradingStatus'),
        score: jest.fn(state => state.score).mockName('selectors.grading.selected.score'),
        gradeStatus: jest.fn(state => state.gradeStatus).mockName('selectors.grading.selected.gradeStatus'),
      },
      selectionLength: jest.fn(state => state.selectionLength).mockName('selectors.grading.selectionLength'),
      activeIndex: jest.fn(() => 0).mockName('selectors.grading.activeIndex'),
      next: {
        doesExist: jest.fn(() => false).mockName('selectors.grading.next.doesExist'),
      },
      prev: {
        doesExist: jest.fn(() => false).mockName('selectors.grading.prev.doesExist'),
      },
    },
    requests: {
      isCompleted: jest.fn((state, { requestKey }) => state.requests?.[requestKey]).mockName('selectors.requests.isCompleted'),
      isPending: jest.fn(() => false).mockName('selectors.requests.isPending'),
      allowNavigation: jest.fn(() => true).mockName('selectors.requests.allowNavigation'),
    },
  },
  thunkActions: {
    app: {
      toggleShowRubric: jest.fn().mockName('thunkActions.app.toggleShowRubric'),
    },
    grading: {
      loadNext: jest.fn().mockName('thunkActions.grading.loadNext'),
      loadPrev: jest.fn().mockName('thunkActions.grading.loadPrev'),
      startGrading: jest.fn().mockName('thunkActions.grading.startGrading'),
      cancelGrading: jest.fn().mockName('thunkActions.grading.cancelGrading'),
    },
  },
}));

jest.mock('./components/StartGradingButton', () => {
  const MockStartGradingButton = () => null;
  return MockStartGradingButton;
});

jest.mock('./components/SubmissionNavigation', () => {
  const MockSubmissionNavigation = () => null;
  return MockSubmissionNavigation;
});

describe('ReviewActions component', () => {
  const renderWithIntl = (component) => render(
    <IntlProvider locale="en" messages={{}}>
      {component}
    </IntlProvider>,
  );

  describe('component', () => {
    const props = {
      gradingStatus: 'ungraded',
      userDisplay: 'test-userDisplay',
      showRubric: false,
      score: { pointsEarned: 3, pointsPossible: 10 },
      toggleShowRubric: jest.fn(),
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('displays user display name', () => {
      const { getByText } = renderWithIntl(<ReviewActions {...props} />);
      expect(getByText('test-userDisplay')).toBeInTheDocument();
    });

    it('does not show rubric button when not loaded', () => {
      const { container } = renderWithIntl(<ReviewActions {...props} />);
      const buttons = container.querySelectorAll('button');
      expect(buttons).toHaveLength(0);
    });

    it('shows rubric button when loaded', () => {
      const { container } = renderWithIntl(<ReviewActions {...props} isLoaded />);
      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('calls toggleShowRubric when button is clicked', () => {
      const { container } = renderWithIntl(<ReviewActions {...props} isLoaded />);
      const button = container.querySelector('button');
      fireEvent.click(button);
      expect(props.toggleShowRubric).toHaveBeenCalledTimes(1);
    });

    it('displays points when pointsPossible is provided', () => {
      const { container } = renderWithIntl(<ReviewActions {...props} />);
      const pointsElement = container.querySelector('.small');
      expect(pointsElement).toBeInTheDocument();
    });

    it('does not display points when pointsPossible is not provided', () => {
      const propsWithoutPoints = {
        ...props,
        score: { pointsEarned: 3, pointsPossible: null },
      };
      const { container } = renderWithIntl(<ReviewActions {...propsWithoutPoints} />);
      const pointsElement = container.querySelector('.small');
      expect(pointsElement).toBeInTheDocument();
    });
  });
  describe('mapStateToProps', () => {
    let mapped;
    const testState = {
      showRubric: true,
      userDisplay: 'test-user',
      gradingStatus: 'test-status',
      score: { pointsEarned: 5, pointsPossible: 10 },
      requests: { [RequestKeys.fetchSubmission]: true },
    };

    beforeEach(() => {
      mapped = mapStateToProps(testState);
    });

    it('maps isLoaded from requests.isCompleted for fetchSubmissions', () => {
      expect(selectors.requests.isCompleted).toHaveBeenCalledWith(
        testState,
        { requestKey: RequestKeys.fetchSubmission },
      );
      expect(mapped.isLoaded).toBe(true);
    });

    it('maps userDisplay from grading.selected.userDisplay', () => {
      expect(selectors.grading.selected.userDisplay).toHaveBeenCalledWith(testState);
      expect(mapped.userDisplay).toBe('test-user');
    });

    it('maps gradingStatus from grading.selected.gradingStatus', () => {
      expect(selectors.grading.selected.gradingStatus).toHaveBeenCalledWith(testState);
      expect(mapped.gradingStatus).toBe('test-status');
    });

    it('maps score from grading.selected.score', () => {
      expect(selectors.grading.selected.score).toHaveBeenCalledWith(testState);
      expect(mapped.score).toEqual({ pointsEarned: 5, pointsPossible: 10 });
    });

    it('maps showRubric from app.showRubric', () => {
      expect(selectors.app.showRubric).toHaveBeenCalledWith(testState);
      expect(mapped.showRubric).toBe(true);
    });
  });
  describe('mapDispatchToProps', () => {
    it('maps toggleShowRubric to actions.app.toggleShowRubric', () => {
      expect(mapDispatchToProps.toggleShowRubric).toEqual(actions.app.toggleShowRubric);
    });
  });
});
