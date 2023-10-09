import React from 'react';
import { shallow } from 'enzyme';

import { ReviewProblemStepsContent, mapStateToProps } from '.';
import ResponsesList from './components/ResponsesList';
import AssessmentsTable from './components/AssessmentsTable';

describe('ReviewProblemStepsContent component', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<ReviewProblemStepsContent toggleShowRubric={() => {}} />);
    expect(wrapper.exists()).toBe(true);
  });

  it('renders ResponsesList component', () => {
    const wrapper = shallow(<ReviewProblemStepsContent toggleShowRubric={() => {}} />);
    expect(wrapper.find(ResponsesList).length).toBe(1);
  });

  it('renders AssessmentsTable component', () => {
    const wrapper = shallow(<ReviewProblemStepsContent toggleShowRubric={() => {}} />);
    expect(wrapper.find(AssessmentsTable).length).toBe(1);
  });

  it('passes toggleShowRubric prop', () => {
    const toggleShowRubric = jest.fn();
    const wrapper = shallow(<ReviewProblemStepsContent toggleShowRubric={toggleShowRubric} />);
    const responsesList = wrapper.find(ResponsesList);
    expect(responsesList.prop('toggleShowRubric')).toBe(toggleShowRubric);
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
