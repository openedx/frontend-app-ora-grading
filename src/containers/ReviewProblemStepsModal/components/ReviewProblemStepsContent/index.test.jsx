import React from 'react';
import { shallow } from 'enzyme';
import { formatMessage } from 'testUtils';
import { ReviewProblemStepsContent, mapStateToProps } from '.';
import ResponsesList from './components/ResponsesList';
import AssessmentsTable from './components/AssessmentsTable';
import ErrorMessage from './components/ErrorMessage';
import * as hooks from './hooks';
import messages from './messages';

describe('ReviewProblemStepsContent component', () => {
  const defaultResponses = { text: [], files: [] };

  const createWrapper = (additionalProps = {}) => {
    const defaultProps = {
      toggleShowRubric: () => {},
      intl: { formatMessage },
      submissionUUID: 'any-id',
      responses: defaultResponses,
      ...additionalProps,
    };
    return shallow(<ReviewProblemStepsContent {...defaultProps} />);
  };

  test('renders without crashing', () => {
    const wrapper = createWrapper();
    expect(wrapper.exists()).toBe(true);
  });

  test('renders ResponsesList component', () => {
    const wrapper = createWrapper();
    expect(wrapper.find(ResponsesList).length).toBe(1);
  });

  test('renders AssessmentsTable component', () => {
    const wrapper = createWrapper();
    expect(wrapper.find(AssessmentsTable).length).toBe(1);
  });

  test('passes toggleShowRubric prop', () => {
    const toggleShowRubric = jest.fn();
    const wrapper = createWrapper({ toggleShowRubric });
    const responsesList = wrapper.find(ResponsesList);
    expect(responsesList.prop('toggleShowRubric')).toBe(toggleShowRubric);
  });

  test('renders ErrorMessage when hasDetailSubmissionError is true', () => {
    const wrapper = createWrapper({ hasDetailSubmissionError: true });
    expect(wrapper.find(ErrorMessage).exists()).toBe(true);
  });

  test('renders ErrorMessage when feedbackListError is true and isLoadingFeedbackList is false', () => {
    const mockedValues = {
      isLoadingFeedbackList: false,
      feedbackList: [],
      feedbackListError: true,
      setFeedbackListType: jest.fn(),
    };

    jest.spyOn(hooks, 'useFeedbackList').mockReturnValue(mockedValues);

    const wrapper = createWrapper();
    const errorMessage = wrapper.find(ErrorMessage);
    expect(errorMessage.exists()).toBe(true);
    expect(errorMessage.prop('title')).toBe(formatMessage(messages.feedbackListTitleError));
    expect(errorMessage.prop('message')).toBe(formatMessage(messages.feedbackListMessageError));
  });

  test('renders AssessmentsTable when feedbackListError is false or isLoadingFeedbackList is true', () => {
    const mockedValues = {
      isLoadingFeedbackList: false,
      feedbackList: [],
      feedbackListError: false,
      setFeedbackListType: jest.fn(),
    };

    jest.spyOn(hooks, 'useFeedbackList').mockReturnValue(mockedValues);

    const wrapper = createWrapper();
    const errorMessage = wrapper.find(ErrorMessage);
    const assessmentsTable = wrapper.find(AssessmentsTable);

    expect(errorMessage.exists()).toBe(false);
    expect(assessmentsTable.exists()).toBe(true);
  });

  test('should call setFeedbackListType with correct arguments when assessments are clicked', () => {
    const mockedValues = {
      isLoadingFeedbackList: false,
      feedbackList: [],
      feedbackListError: false,
      setFeedbackListType: jest.fn(),
    };

    jest.spyOn(hooks, 'useFeedbackList').mockReturnValue(mockedValues);

    const wrapper = createWrapper();
    const assessmentsTable = wrapper.find(AssessmentsTable);

    // Simulate click on received assessment
    assessmentsTable.prop('onClickReceivedAssessment')();
    // Simulate click on given assessment
    assessmentsTable.prop('onClickGivenAssessment')();

    expect(mockedValues.setFeedbackListType).toHaveBeenCalledWith('received');
    expect(mockedValues.setFeedbackListType).toHaveBeenCalledWith('given');
  });
});

describe('mapStateToProps', () => {
  test('maps state to props correctly', () => {
    const initialState = {
      app: {
        showRubric: true,
      },
    };
    const props = mapStateToProps(initialState);
    expect(props.showRubric).toBe(true);
  });
});
