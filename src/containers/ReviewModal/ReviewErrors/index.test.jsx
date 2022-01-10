import React from 'react';
import { shallow } from 'enzyme';

import { ReviewErrors } from '.';

jest.mock('./FetchErrors', () => 'FetchErrors');
jest.mock('./SubmitErrors', () => 'SubmitErrors');
jest.mock('./LockErrors', () => 'LockErrors');
jest.mock('./DownloadErrors', () => 'DownloadErrors');

describe('ReviewErrors component', () => {
  describe('component', () => {
    test('snapshot: no failure', () => {
      expect(shallow(<ReviewErrors />)).toMatchSnapshot();
    });
  });
});
