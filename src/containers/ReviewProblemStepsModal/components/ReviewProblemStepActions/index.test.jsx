import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';
import { formatMessage } from 'testUtils';
import { ReviewProblemStepActions } from '.';

import messages from './messages';

describe('ReviewProblemStepActions component', () => {
  const defaultProps = {
    fullname: 'John Doe',
    username: 'john_20',
    email: 'johnvente@email.com',
    submissionId: '483234704918',
    submissionDate: '9/13/2023, 7:13:56 AM',
    grade: '3/10',
    gradingStatus: 'Upgraded',
  };

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<ReviewProblemStepActions intl={{ formatMessage }} {...defaultProps} />);
  });

  describe('Should render the correct titles', () => {
    test('renders the correct email title', () => {
      expect(wrapper.find('[data-testid="email-title"]').text()).toEqual(
        formatMessage(messages.emailTitle),
      );
    });

    test('renders the correct submission ID title', () => {
      expect(wrapper.find('[data-testid="submission-id-title"]').text()).toEqual(
        formatMessage(messages.submissionIdTitle),
      );
    });

    test('renders the correct submission date title', () => {
      expect(wrapper.find('[data-testid="submission-date-title"]').text()).toEqual(
        formatMessage(messages.submissionDateTitle),
      );
    });

    test('renders the correct grade title', () => {
      expect(wrapper.find('[data-testid="grade-title"]').text()).toEqual(
        formatMessage(messages.gradeTitle),
      );
    });

    test('renders the correct grading status title', () => {
      expect(wrapper.find('[data-testid="grade-status-title"]').text()).toEqual(
        formatMessage(messages.gradingStatus),
      );
    });

    test('renders the correct problem steps title', () => {
      expect(wrapper.find('[data-testid="problem-steps-title"]').text()).toEqual(
        formatMessage(messages.problemStepsTitle),
      );
    });
  });

  test('renders the correct props data', () => {
    expect(true).toBe(true);
    expect(wrapper.find('[data-testid="fullname-value"]').text()).toEqual('John Doe');
    expect(wrapper.find('[data-testid="username-value"]').text()).toEqual('john_20');
    expect(wrapper.find('[data-testid="email-value"]').text()).toEqual(defaultProps.email);
    expect(wrapper.find('[data-testid="submission-id-value"]').text()).toEqual(defaultProps.submissionId);
    expect(wrapper.find('[data-testid="submission-date-value"]').text()).toEqual(defaultProps.submissionDate);
    expect(wrapper.find('[data-testid="grade-value"]').text()).toEqual(defaultProps.grade);
    expect(wrapper.find('[data-testid="grade-status-value"]').text()).toEqual(defaultProps.gradingStatus);
  });
});
