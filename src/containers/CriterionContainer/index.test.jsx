import { render, screen } from '@testing-library/react';
import PropTypes from 'prop-types';

import { selectors } from 'data/redux';
import { gradeStatuses } from 'data/services/lms/constants';

import { CriterionContainer, mapStateToProps } from '.';

const MockRadioCriterion = ({ orderNum, isGrading }) => (
  <div data-testid="radio-criterion-component">
    RadioCriterion Component (orderNum={orderNum}, isGrading={String(isGrading)})
  </div>
);

MockRadioCriterion.propTypes = {
  orderNum: PropTypes.number.isRequired,
  isGrading: PropTypes.bool.isRequired,
};

const MockReviewCriterion = ({ orderNum }) => (
  <div data-testid="review-criterion-component">
    ReviewCriterion Component (orderNum={orderNum})
  </div>
);

MockReviewCriterion.propTypes = {
  orderNum: PropTypes.number.isRequired,
};

const MockCriterionFeedback = ({ orderNum, isGrading }) => (
  <div data-testid="criterion-feedback-component">
    CriterionFeedback Component (orderNum={orderNum}, isGrading={String(isGrading)})
  </div>
);

MockCriterionFeedback.propTypes = {
  orderNum: PropTypes.number.isRequired,
  isGrading: PropTypes.bool.isRequired,
};

const MockInfoPopover = ({ children }) => (
  <div data-testid="info-popover">{children}</div>
);

MockInfoPopover.propTypes = {
  children: PropTypes.node.isRequired,
};

jest.mock('data/redux/app/selectors', () => ({
  rubric: {
    criterionConfig: jest.fn((...args) => ({
      rubricCriterionConfig: args,
    })),
  },
}));

jest.mock('data/redux/grading/selectors', () => ({
  selected: {
    gradeStatus: jest.fn((...args) => ({ selectedGradeStatus: args })),
  },
}));

jest.mock('./RadioCriterion', () => jest.fn((props) => MockRadioCriterion(props)));
jest.mock('./ReviewCriterion', () => jest.fn((props) => MockReviewCriterion(props)));
jest.mock('./CriterionFeedback', () => jest.fn((props) => MockCriterionFeedback(props)));
jest.mock('components/InfoPopover', () => jest.fn((props) => MockInfoPopover(props)));

describe('Criterion Container', () => {
  const props = {
    isGrading: true,
    orderNum: 1,
    config: {
      prompt: 'prompt',
      name: 'random name',
      feedback: 'feedback mock',
      options: [
        {
          explanation: 'explanation',
          feedback: 'option feedback',
          label: 'this label',
          name: 'option name',
          points: 2,
        },
        {
          explanation: 'explanation 2',
          feedback: 'option feedback 2',
          label: 'this label 2',
          name: 'option name 2',
          points: 1,
        },
      ],
    },
    gradeStatus: gradeStatuses.ungraded,
  };

  describe('component rendering', () => {
    it('displays the criterion prompt', () => {
      render(<CriterionContainer {...props} />);
      expect(screen.getByText('prompt')).toBeInTheDocument();
    });

    it('displays all option explanations in the info popover', () => {
      render(<CriterionContainer {...props} />);
      const infoPopover = screen.getByTestId('info-popover');
      expect(infoPopover).toHaveTextContent('explanation');
      expect(infoPopover).toHaveTextContent('explanation 2');
      expect(infoPopover).toHaveTextContent('this label');
      expect(infoPopover).toHaveTextContent('this label 2');
    });

    it('renders RadioCriterion when is ungraded and is grading', () => {
      render(<CriterionContainer {...props} />);
      expect(screen.getByTestId('radio-criterion-component')).toBeInTheDocument();
      expect(screen.queryByTestId('review-criterion-component')).not.toBeInTheDocument();
    });

    it('renders ReviewCriterion when is ungraded and is not grading', () => {
      render(<CriterionContainer {...props} isGrading={false} />);
      expect(screen.getByTestId('review-criterion-component')).toBeInTheDocument();
      expect(screen.queryByTestId('radio-criterion-component')).not.toBeInTheDocument();
    });

    it('renders RadioCriterion when is graded and is not grading', () => {
      render(<CriterionContainer {...props} isGrading={false} gradeStatus={gradeStatuses.graded} />);
      expect(screen.getByTestId('radio-criterion-component')).toBeInTheDocument();
      expect(screen.queryByTestId('review-criterion-component')).not.toBeInTheDocument();
    });

    it('renders CriterionFeedback component', () => {
      render(<CriterionContainer {...props} />);
      expect(screen.getByTestId('criterion-feedback-component')).toBeInTheDocument();
    });
  });

  describe('mapStateToProps', () => {
    const testState = { arbitraryState: 'some data' };
    const ownProps = { orderNum: props.orderNum };
    let mapped;

    beforeEach(() => {
      mapped = mapStateToProps(testState, ownProps);
    });

    it('maps rubric criterion config to props', () => {
      expect(mapped.config).toEqual(
        selectors.app.rubric.criterionConfig(testState, ownProps),
      );
    });

    it('maps grading status to props', () => {
      expect(mapped.gradeStatus).toEqual(
        selectors.grading.selected.gradeStatus(testState),
      );
    });
  });
});
