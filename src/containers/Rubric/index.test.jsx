import { screen } from '@testing-library/react';
import { renderWithIntl } from '../../testUtils';
import { Rubric } from '.';
import * as hooks from './hooks';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(() => jest.fn()),
  connect: jest.fn((mapStateToProps, mapDispatchToProps) => (Component) => {
    const ConnectedComponent = (props) => {
      const mockState = {};
      const stateProps = mapStateToProps ? mapStateToProps(mockState, props) : {};
      const dispatchProps = mapDispatchToProps || {};
      return <Component {...props} {...stateProps} {...dispatchProps} />;
    };
    return ConnectedComponent;
  }),
}));

jest.mock('data/redux', () => ({
  actions: {
    grading: {
      setCriterionOption: jest.fn(),
      setRubricFeedback: jest.fn(),
    },
  },
  selectors: {
    app: {
      courseId: jest.fn(() => 'test-course-id'),
      isEnabled: jest.fn(() => false),
      rubric: {
        criteriaIndices: jest.fn(() => [0, 1]),
        criterionConfig: jest.fn((state, { orderNum }) => ({
          name: `test-criterion-${orderNum}`,
          prompt: `Test criterion prompt ${orderNum}`,
          options: [
            {
              name: 'option1',
              label: 'Option 1',
              points: 1,
              explanation: 'First option',
            },
            {
              name: 'option2',
              label: 'Option 2',
              points: 2,
              explanation: 'Second option',
            },
          ],
        })),
        criterionFeedbackConfig: jest.fn((state, { orderNum }) => ({
          feedbackEnabled: true,
          defaultValue: `Default feedback for criterion ${orderNum}`,
        })),
        feedbackConfig: jest.fn(() => ({
          enabled: true,
          defaultValue: 'Overall feedback default',
        })),
        feedbackPrompt: jest.fn(() => 'Please provide overall feedback'),
      },
    },
    grading: {
      selected: {
        gradeStatus: jest.fn(() => 'ungraded'),
        isGrading: jest.fn(() => true),
        criterionSelectedOption: jest.fn(() => 'option1'),
        criterionFeedback: jest.fn(() => 'Test feedback'),
        overallFeedback: jest.fn(() => 'Test overall feedback'),
      },
      validation: {
        criterionSelectedOptionIsInvalid: jest.fn(() => false),
        criterionFeedbackIsInvalid: jest.fn(() => false),
        overallFeedbackIsInvalid: jest.fn(() => false),
      },
    },
    requests: {
      isPending: jest.fn(() => false),
      isCompleted: jest.fn(() => false),
    },
  },
  thunkActions: {
    grading: {
      submitGrade: jest.fn(() => jest.fn()),
    },
  },
}));

jest.mock('./hooks', () => ({
  rendererHooks: jest.fn(),
  ButtonStates: jest.requireActual('./hooks').ButtonStates,
}));

describe('Rubric Container', () => {
  const hookProps = {
    criteria: [
      { orderNum: 1, key: 1, isGrading: true },
      { orderNum: 2, key: 2, isGrading: true },
    ],
    showFooter: false,
    buttonProps: { variant: 'primary' },
    demoAlertProps: { show: false },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    hooks.rendererHooks.mockReturnValue(hookProps);
  });

  it('renders rubric with submit button in footer when showFooter is true', () => {
    hooks.rendererHooks.mockReturnValueOnce({ ...hookProps, showFooter: true });
    renderWithIntl(<Rubric />);
    const rubricCardTitle = screen.getByRole('heading', { name: /rubric/i });
    const submitButton = screen.queryByRole('button', { name: /submit grade/i });
    expect(rubricCardTitle).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  it('renders rubric without submit button on footer when showFooter is false', () => {
    renderWithIntl(<Rubric />);
    const rubricCardTitle = screen.getByRole('heading', { name: /rubric/i });
    const submitButton = screen.queryByRole('button', { name: /submit grade/i });
    expect(rubricCardTitle).toBeInTheDocument();
    expect(submitButton).not.toBeInTheDocument();
  });
});
