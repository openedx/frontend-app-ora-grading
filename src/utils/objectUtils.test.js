import { camelizeKeys } from './objectUtils';

describe('camelizeKeys function', () => {
  it('returns an empty object when an empty object is provided', () => {
    const input = {};
    const output = camelizeKeys(input);
    expect(output).toEqual({});
  });

  it('converts keys from snake_case to camelCase in a simple object', () => {
    const input = {
      user_name: 'John',
      age_of_person: 35,
      address_details: {
        street_address: '123 Main St',
        postal_code: '12345',
      },
    };
    const expectedOutput = {
      userName: 'John',
      ageOfPerson: 35,
      addressDetails: {
        streetAddress: '123 Main St',
        postalCode: '12345',
      },
    };
    const output = camelizeKeys(input);
    expect(output).toEqual(expectedOutput);
  });

  it('converts keys from snake_case to camelCase in an array of objects', () => {
    const input = [
      {
        first_name: 'Alice',
        last_name: 'Smith',
        age_group: '30-40',
      },
      {
        first_name: 'Bob',
        last_name: 'Johnson',
        age_group: '20-30',
      },
    ];
    const expectedOutput = [
      {
        firstName: 'Alice',
        lastName: 'Smith',
        ageGroup: '30-40',
      },
      {
        firstName: 'Bob',
        lastName: 'Johnson',
        ageGroup: '20-30',
      },
    ];
    const output = camelizeKeys(input);
    expect(output).toEqual(expectedOutput);
  });

  it('returns the same output if non-object/array values are provided', () => {
    const input = 'This is a string';
    const output = camelizeKeys(input);
    expect(output).toEqual(input);

    const nullInput = null;
    const nullOutput = camelizeKeys(nullInput);
    expect(nullOutput).toEqual(null);

    const undefinedInput = undefined;
    const undefinedOutput = camelizeKeys(undefinedInput);
    expect(undefinedOutput).toEqual(undefined);
  });
});
