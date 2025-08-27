import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { actions, selectors } from 'data/redux';
import { feedbackRequirement, gradeStatuses } from 'data/services/lms/constants';
import { RubricFeedback, mapDispatchToProps, mapStateToProps } from './RubricFeedback';

jest.unmock('@openedx/paragon');
jest.unmock('react');
jest.unmock('@edx/frontend-platform/i18n');

jest.mock('data/redux', () => ({
  actions: {
    grading: { setRubricFeedback: jest.fn() },
  },
  selectors: {
    app: {
      rubric: {
        feedbackConfig: jest.fn((state) => state.config || 'config string'),
        feedbackPrompt: jest.fn((state) => state.feedbackPrompt || 'feedback prompt'),
      },
    },
    grading: {
      selected: {
        overallFeedback: jest.fn((state) => state.value || 'some value'),
        isGrading: jest.fn((state) => (state.isGrading !== undefined ? state.isGrading : true)),
      },
      validation: {
        overallFeedbackIsInvalid: jest.fn((state) => state.isInvalid || false),
      },
    },
  },
}));

const renderWithIntl = (component) => render(
  <IntlProvider locale="en" messages={{}}>
    {component}
  </IntlProvider>,
);

describe('Rubric Feedback component', () => {
  const defaultProps = {
    config: 'config string',
    isGrading: true,
    value: 'some value',
    isInvalid: false,
    gradeStatus: gradeStatuses.ungraded,
    setValue: jest.fn(),
    intl: {
      formatMessage: jest.fn((message) => message.defaultMessage),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render feedback form when config is not disabled', () => {
    const { getByText } = renderWithIntl(<RubricFeedback {...defaultProps} />);
    expect(getByText('Overall comments')).toBeInTheDocument();
  });

  it('should not render when config is disabled', () => {
    const props = { ...defaultProps, config: feedbackRequirement.disabled };
    const { container } = renderWithIntl(<RubricFeedback {...props} />);
    expect(container.firstChild).toBeNull();
  });

  it('should display feedback prompt in info popover', async () => {
    const { getByText, getByTestId } = renderWithIntl(<RubricFeedback {...defaultProps} />);
    const user = userEvent.setup();
    const infoIcon = getByTestId('esg-help-icon');
    await user.click(infoIcon);
    expect(getByText(defaultProps.value)).toBeInTheDocument();
  });

  it('should render textarea with correct value', () => {
    renderWithIntl(<RubricFeedback {...defaultProps} />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveValue(defaultProps.value);
  });

  it('should enable textarea when isGrading is true', () => {
    renderWithIntl(<RubricFeedback {...defaultProps} />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).not.toBeDisabled();
  });

  it('should disable textarea when isGrading is false', () => {
    const props = { ...defaultProps, isGrading: false, gradeStatus: gradeStatuses.graded };
    renderWithIntl(<RubricFeedback {...props} />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeDisabled();
  });

  it('should display error message when isInvalid is true', () => {
    const props = { ...defaultProps, isInvalid: true };
    const { getByText } = renderWithIntl(<RubricFeedback {...props} />);
    expect(getByText('The overall feedback is required')).toBeInTheDocument();
  });

  it('should not display error message when isInvalid is false', () => {
    const { queryByText } = renderWithIntl(<RubricFeedback {...defaultProps} />);
    expect(queryByText('The overall feedback is required')).not.toBeInTheDocument();
  });

  it('should call setValue when textarea value changes', async () => {
    renderWithIntl(<RubricFeedback {...defaultProps} />);
    const user = userEvent.setup();
    const textarea = screen.getByRole('textbox');
    await user.clear(textarea);
    expect(defaultProps.setValue).toHaveBeenCalledWith('');
  });

  describe('mapStateToProps', () => {
    it('should map state properties correctly', () => {
      const testState = { arbitraryState: 'some data' };
      const mapped = mapStateToProps(testState);

      expect(selectors.grading.selected.isGrading).toHaveBeenCalledWith(testState);
      expect(selectors.app.rubric.feedbackConfig).toHaveBeenCalledWith(testState);
      expect(selectors.grading.selected.overallFeedback).toHaveBeenCalledWith(testState);
      expect(selectors.grading.validation.overallFeedbackIsInvalid).toHaveBeenCalledWith(testState);
      expect(selectors.app.rubric.feedbackPrompt).toHaveBeenCalledWith(testState);

      expect(mapped.isGrading).toEqual(selectors.grading.selected.isGrading(testState));
      expect(mapped.config).toEqual(selectors.app.rubric.feedbackConfig(testState));
      expect(mapped.value).toEqual(selectors.grading.selected.overallFeedback(testState));
      expect(mapped.isInvalid).toEqual(selectors.grading.validation.overallFeedbackIsInvalid(testState));
      expect(mapped.feedbackPrompt).toEqual(selectors.app.rubric.feedbackPrompt(testState));
    });
  });

  describe('mapDispatchToProps', () => {
    it('should map setValue to setRubricFeedback action', () => {
      expect(mapDispatchToProps.setValue).toEqual(actions.grading.setRubricFeedback);
    });
  });
});
