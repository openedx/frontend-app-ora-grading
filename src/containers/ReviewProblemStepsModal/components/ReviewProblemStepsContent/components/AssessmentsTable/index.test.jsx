import React from 'react';
import { shallow } from 'enzyme';
import { formatMessage } from 'testUtils';
import {
  DataTable,
  Hyperlink,
  Button,
} from '@edx/paragon';

import messages from './messages';
import { AssessmentsTable } from '.';

describe('AssessmentsTable component', () => {
  let el;
  let handleReceivedAssessmentsSpy;
  let handleGivenAssessmentsSpy;
  const mockDataTableData = [
    {
      idAssessment: '55550453040',
      reviewerName: 'Carlos Doe',
      userName: 'carlos_doe_10',
      email: 'carlos@email.com',
      assessmentDate: '28-10-2023',
      assessmentScores: [{
        id: 'aB3cD7eF',
        type: 'Ideas',
        quality: 'Fair',
        rate: 1,
      },
      {
        id: '9GhI2jKl',
        type: 'Content',
        quality: 'Excellent',
        rate: 5,
      }],
      problemStep: 'Staff',
      feedback: 'This is working really well',
    },
    {
      idAssessment: '55550453042',
      reviewerName: 'John Smith',
      userName: 'john_smith_23',
      email: 'john@email.com',
      assessmentDate: '30-10-2023',
      assessmentScores: [{
        id: 'M4nO8pQr',
        type: 'Ideas',
        quality: 'Good',
        rate: 5,
      },
      {
        id: 'X5tU6vWx',
        type: 'Content',
        quality: 'Excellent',
        rate: 5,
      }],
      problemStep: 'Training',
      feedback: 'Great progress!',
    },
    {
      idAssessment: '55550453048',
      reviewerName: 'Emily Johnson',
      userName: 'emily_j',
      email: 'emily@email.com',
      assessmentDate: '29-10-2023',
      assessmentScores: [{
        id: 'PqW0uVwX',
        type: 'Ideas',
        quality: null,
        rate: null,
      },
      {
        id: 'ZabC12DE',
        type: 'Content',
        quality: null,
        rate: null,
      }],
      problemStep: 'Peers',
      feedback: 'Needs improvement in certain areas.',
    },
    {
      idAssessment: '55550453050',
      reviewerName: 'Sarah Brown',
      userName: 'sarah_brown_45',
      email: 'sarah@email.com',
      assessmentDate: '31-10-2023',
      assessmentScores: [{
        id: 'Yz123456',
        type: 'Ideas',
        quality: 'Good',
        rate: 3,
      },
      {
        id: 'L7iR9oSt',
        type: 'Content',
        quality: 'Excellent',
        rate: 5,
      }],
      problemStep: 'Self',
      feedback: 'Excellent work, keep it up!',
    },
  ];

  beforeEach(() => {
    handleReceivedAssessmentsSpy = jest.fn();
    handleGivenAssessmentsSpy = jest.fn();

    el = shallow(<AssessmentsTable
      intl={{ formatMessage }}
      onClickReceivedAssessment={handleReceivedAssessmentsSpy}
      onClickGivenAssessment={handleGivenAssessmentsSpy}
      assessmentsList={mockDataTableData}
    />);
  });
  test('renders without crashing', () => {
    expect(el.exists()).toBe(true);
  });

  test('renders the correct title', () => {
    const h3Title = el.find('h3');
    expect(h3Title.text()).toBe(
      formatMessage(messages.assessmentsTableTitle),
    );
  });

  test('should render assessment given button and assessment received button', () => {
    const assessmentReceivedButton = el.find('[data-testid="assessments-received-button"]');
    const assessmentGivenButton = el.find('[data-testid="assessments-given-button"]');

    expect(assessmentReceivedButton.exists()).toBe(true);
    expect(assessmentGivenButton.exists()).toBe(true);

    expect(assessmentReceivedButton.text()).toBe(
      formatMessage(messages.assessmentsReceivedButtonTitle),
    );
    expect(assessmentGivenButton.text()).toBe(
      formatMessage(messages.assessmentsGivenButtonTitle),
    );
  });

  test('should call the correct onClick handler when the "Received Assessments" button is clicked', () => {
    const assessmentReceivedButton = el.find('[data-testid="assessments-received-button"]');
    assessmentReceivedButton.simulate('click');

    el.setProps({});
    el.update();

    const assessmentReceivedButtonAfterClick = el.find('[data-testid="assessments-received-button"]');
    expect(assessmentReceivedButtonAfterClick.prop('variant')).toBe('primary');
    expect(handleReceivedAssessmentsSpy).toHaveBeenCalled();
  });

  test('should call the correct onClick handler when the "Given Assessments" button is clicked', () => {
    const assessmentGivenButton = el.find('[data-testid="assessments-given-button"]');

    assessmentGivenButton.simulate('click');

    el.setProps({});
    el.update();

    const assessmentGivenButtonAfterClick = el.find('[data-testid="assessments-given-button"]');
    expect(assessmentGivenButton.prop('variant')).toBe('inverse-primary');
    expect(assessmentGivenButtonAfterClick.prop('variant')).toBe('primary');
    expect(handleGivenAssessmentsSpy).toHaveBeenCalled();
  });

  describe('DataTable', () => {
    let table;
    let tableProps;
    beforeEach(() => {
      table = el.find(DataTable);
      tableProps = table.props();
    });
    test.each([
      'isSelectable',
    ])('%s', key => expect(tableProps[key]).toEqual(true));

    describe('individual columns', () => {
      let columns;
      beforeEach(() => {
        columns = tableProps.columns;
      });

      test('ID Assessment column', () => {
        expect(columns[0]).toEqual({
          Header: formatMessage(messages.idAssessmentColumnTitle),
          accessor: 'idAssessment',
        });
      });
      test('Reviewer name or Learner name column', () => {
        expect(columns[1]).toEqual({
          Header: formatMessage(messages.reviewerNameColumnTitle),
          accessor: 'reviewerName',
        });
      });
      test('User name column', () => {
        expect(columns[2]).toEqual({
          Header: formatMessage(messages.usernameColumnTitle),
          accessor: 'userName',
        });
      });
      test('Email column', () => {
        const emailColumn = tableProps.columns.find((column) => column.accessor === 'email');
        expect(emailColumn.Header).toBe(
          formatMessage(messages.emailColumnTitle),
        );
      });
      test('Assessment date column', () => {
        const assessmentDateColumn = tableProps.columns.find((column) => column.accessor === 'assessmentDate');
        expect(assessmentDateColumn.Header).toBe(
          formatMessage(messages.assessmentDateColumnTitle),
        );
      });

      test('Assessment scores column', () => {
        const assessmentScoresColumn = tableProps.columns.find((column) => column.accessor === 'assessmentScores');
        expect(assessmentScoresColumn.Header).toBe(
          formatMessage(messages.assessmentScoresColumnTitle),
        );
      });

      test('Problem step column', () => {
        const problemStepColumn = tableProps.columns.find((column) => column.accessor === 'problemStep');
        expect(problemStepColumn.Header).toBe(
          formatMessage(messages.problemStepColumnTitle),
        );
      });

      test('Feedback column', () => {
        const feedbackColumn = tableProps.columns.find((column) => column.accessor === 'feedback');
        expect(feedbackColumn.Header).toBe(
          formatMessage(messages.feedbackColumnTitle),
        );
      });
    });
    describe('behavior columns', () => {
      describe('Assessment Score Column', () => {
        let assessmentScoresColumn;
        let firstItemMock;
        let Cell;
        beforeEach(() => {
          assessmentScoresColumn = tableProps.columns.find((column) => column.accessor === 'assessmentScores');
          const [firstItemMockData] = mockDataTableData;
          firstItemMock = firstItemMockData;
          const { assessmentScores } = firstItemMock;
          Cell = () => assessmentScoresColumn.Cell({ value: assessmentScores });
        });

        test('renders assessment scores correctly', () => {
          const wrapper = shallow(<Cell />);
          expect(wrapper.find('li')).toHaveLength(2);
        });

        test('renders assessment scores with correct values', () => {
          const wrapper = shallow(<Cell />);
          expect(wrapper.find('li').at(0).text()).toBe('Ideas: Fair (1)');
          expect(wrapper.find('li').at(1).text()).toBe('Content: Excellent (5)');
        });
      });
      describe('Assessment Email Column', () => {
        let emailColumn;
        let firstItemMock;
        let Cell;
        let emailValue;
        beforeEach(() => {
          emailColumn = tableProps.columns.find((column) => column.accessor === 'email');
          const [firstItemMockData] = mockDataTableData;
          firstItemMock = firstItemMockData;
          const { email } = firstItemMock;
          emailValue = email;
          Cell = () => emailColumn.Cell({ value: email });
        });

        test('renders Hyperlink with correct email', () => {
          const wrapper = shallow(<Cell />);
          expect(wrapper.find(Hyperlink).prop('children')).toBe(emailValue);
        });
      });

      describe('Assessment Problem Step Badge', () => {
        let problemStepColumn;
        let firstItemMock;
        let Cell;
        beforeEach(() => {
          problemStepColumn = tableProps.columns.find((column) => column.accessor === 'problemStep');
          const [firstItemMockData] = mockDataTableData;
          firstItemMock = firstItemMockData;
          const { problemStep } = firstItemMock;
          Cell = () => problemStepColumn.Cell({ value: problemStep });
        });

        test('renders Button with correct status and title', () => {
          const wrapper = shallow(<Cell />);
          expect(wrapper.find(Button).prop('children').props.status).toBe('graded');
          expect(wrapper.find(Button).prop('children').props.title).toBe('Staff');
        });
      });
    });
  });
});
