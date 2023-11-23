import {
  formatDate, formatGrade, capitalizeFirstLetter, transformObjectToDetail,
} from './utils';

describe('formatDate util', () => {
  it('formats date string into a localized string', () => {
    const date = '2023-11-17T08:30:00Z';
    const formattedDate = formatDate(date);
    expect(formattedDate).toBe(new Date(date).toLocaleString());
  });

  it('handles empty date string', () => {
    const formattedDate = formatDate();
    expect(formattedDate).toBe(new Date('').toLocaleString());
  });
});

describe('formatGrade util', () => {
  it('formats score object into a grade string', () => {
    const score = { pointsEarned: 85, pointsPossible: 100 };
    const formattedGrade = formatGrade(score);
    expect(formattedGrade).toBe('85/100');
  });

  it('handles null score object', () => {
    const formattedGrade = formatGrade(null);
    expect(formattedGrade).toBe('-');
  });
});

describe('capitalizeFirstLetter util', () => {
  it('capitalizes the first letter of a string', () => {
    const str = 'test';
    const capitalizedStr = capitalizeFirstLetter(str);
    expect(capitalizedStr).toBe('Test');
  });

  it('handles empty string', () => {
    const capitalizedStr = capitalizeFirstLetter();
    expect(capitalizedStr).toBe('');
  });

  it('handles already capitalized util', () => {
    const str = 'Test';
    const capitalizedStr = capitalizeFirstLetter(str);
    expect(capitalizedStr).toBe('Test');
  });
});

describe('transformObjectToDetail util', () => {
  it('transforms object details as expected', () => {
    const inputObject = {
      fullname: 'John Doe',
      username: 'johndoe123',
      email: 'john@example.com',
      submissionUUID: '123456789',
      dateSubmitted: '2023-11-17T08:30:00Z',
      score: { pointsEarned: 85, pointsPossible: 100 },
      gradeStatus: 'complete',
    };

    const expectedOutput = {
      fullname: 'John Doe',
      username: 'johndoe123',
      email: 'john@example.com',
      submissionId: '123456789',
      submissionDate: new Date('2023-11-17T08:30:00Z').toLocaleString(),
      grade: '85/100',
      gradingStatus: 'Complete',
    };

    const transformedObject = transformObjectToDetail(inputObject);
    expect(transformedObject).toEqual(expectedOutput);
  });

  it('handles missing or empty properties in the input object', () => {
    const inputObject = {
      fullname: 'Jane Doe',
    };

    const expectedOutput = {
      fullname: 'Jane Doe',
      username: '',
      email: '',
      submissionId: '',
      submissionDate: new Date('').toLocaleString(),
      grade: '-',
      gradingStatus: '',
    };

    const transformedObject = transformObjectToDetail(inputObject);
    expect(transformedObject).toEqual(expectedOutput);
  });
});
