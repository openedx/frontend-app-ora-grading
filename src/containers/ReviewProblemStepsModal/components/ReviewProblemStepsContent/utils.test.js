import { assessmentTableFormat, responsesListFormat } from './utils';

describe('assessmentTableFormat', () => {
  test('formats assessment data correctly', () => {
    const inputAssessmentData = [
      {
        assessmentId: 1,
        assesmentDate: '2023-11-17',
        scorerEmail: 'scorer@example.com',
        scorerName: 'Scorer 1',
        scorerUsername: 'scorer1',
        feedback: 'Good work!',
        problemStep: 'Problem Step 1',
        assesmentScores: [
          { criterionName: 'Criterion 1', scoreEarned: 8, scoreType: 'High' },
          { criterionName: 'Criterion 2', scoreEarned: 6, scoreType: 'Medium' },
        ],
      },
    ];

    const formattedAssessmentData = assessmentTableFormat(inputAssessmentData);

    expect(formattedAssessmentData).toEqual([
      {
        assessmentId: 1,
        reviewerName: 'Scorer 1',
        userName: 'scorer1',
        email: 'scorer@example.com',
        assessmentDate: '2023-11-17',
        assessmentScores: [
          {
            id: expect.any(String), type: 'Criterion 1', quality: 'High', rate: 8,
          },
          {
            id: expect.any(String), type: 'Criterion 2', quality: 'Medium', rate: 6,
          },
        ],
        feedback: 'Good work!',
        problemStep: 'Problem Step 1',
      },

    ]);
  });
});

describe('responsesListFormat', () => {
  test('formats responses data correctly', () => {
    const inputResponsesData = [
      'Response 1',
      'Response 2',
    ];

    const formattedResponsesData = responsesListFormat(inputResponsesData);

    expect(formattedResponsesData).toEqual([
      { id: expect.any(String), title: 'Prompt 1', response: 'Response 1' },
      { id: expect.any(String), title: 'Prompt 2', response: 'Response 2' },
    ]);
  });

  test('returns an empty array for invalid input', () => {
    const invalidInput = 'Invalid';

    const formattedResponsesData = responsesListFormat(invalidInput);

    expect(formattedResponsesData).toEqual([]);
  });
});
