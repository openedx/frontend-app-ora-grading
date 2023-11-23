import React from 'react';
import { shallow } from 'enzyme';
import { formatMessage } from 'testUtils';
import { ReviewProblemStepsContent, mapStateToProps } from '.';
import ResponsesList from './components/ResponsesList';
import AssessmentsTable from './components/AssessmentsTable';
import ErrorMessage from './components/ErrorMessage';

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

  it('renders without crashing', () => {
    const wrapper = createWrapper();
    expect(wrapper.exists()).toBe(true);
  });

  it('renders ResponsesList component', () => {
    const wrapper = createWrapper();
    expect(wrapper.find(ResponsesList).length).toBe(1);
  });

  it('renders AssessmentsTable component', () => {
    const wrapper = createWrapper();
    expect(wrapper.find(AssessmentsTable).length).toBe(1);
  });

  it('passes toggleShowRubric prop', () => {
    const toggleShowRubric = jest.fn();
    const wrapper = createWrapper({ toggleShowRubric });
    const responsesList = wrapper.find(ResponsesList);
    expect(responsesList.prop('toggleShowRubric')).toBe(toggleShowRubric);
  });

  it('renders ErrorMessage when hasDetailSubmissionError is true', () => {
    const wrapper = createWrapper({ hasDetailSubmissionError: true });
    expect(wrapper.find(ErrorMessage).exists()).toBe(true);
  });
});

describe('mapStateToProps', () => {
  it('maps state to props correctly', () => {
    const initialState = {
      app: {
        showRubric: true,
      },
    };
    const props = mapStateToProps(initialState);
    expect(props.showRubric).toBe(true);
  });
});
