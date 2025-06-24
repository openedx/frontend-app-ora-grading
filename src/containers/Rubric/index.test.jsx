import { render } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { Rubric } from '.';
import * as hooks from './hooks';

jest.unmock('@openedx/paragon');
jest.unmock('react');
jest.unmock('@edx/frontend-platform/i18n');

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

const renderWithIntl = (component) => render(
  <IntlProvider locale="en" messages={{}}>
    {component}
  </IntlProvider>,
);

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

  it('renders rubric with footer when showFooter is true', () => {
    hooks.rendererHooks.mockReturnValueOnce({ ...hookProps, showFooter: true });
    const { container } = renderWithIntl(<Rubric />);
    const rubricCard = container.querySelector('.grading-rubric-card');
    const footer = container.querySelector('.grading-rubric-footer');
    expect(rubricCard).toBeInTheDocument();
    expect(footer).toBeInTheDocument();
  });

  it('renders rubric without footer when showFooter is false', () => {
    const { container } = renderWithIntl(<Rubric />);
    const rubricCard = container.querySelector('.grading-rubric-card');
    const footer = container.querySelector('.grading-rubric-footer');
    expect(rubricCard).toBeInTheDocument();
    expect(footer).not.toBeInTheDocument();
  });
});
