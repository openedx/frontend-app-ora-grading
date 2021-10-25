import React from 'react';
import { shallow } from 'enzyme';

import selectors from 'data/selectors';

import { ResponseDisplay, mapStateToProps } from '.';

jest.mock('@edx/paragon', () => {
  const Card = () => 'Card';
  Card.Body = 'Body';
  return {
    Card
  }
});

jest.mock('data/selectors', () => ({
  __esModule: true,
  default: {
    grading: {
      selected: {
        response: (state) => ({ response: state }),
      },
    },
  },
}));
jest.mock('./SubmissionFiles', () => 'SubmissionFiles');
jest.mock('dompurify', () => () => ({ sanitize: (text) => `sanitized (${text})`}));
jest.mock('html-react-parser', () => (text) => `parsed html (${text})`);

describe('ResponseDisplay', () => {
  describe('component', () => {
    const props = {
      response: {
        text: 'some text response here',
        files: [
          {
            name: 'some file name.jpg',
            description: 'description for the file',
            downloadUrl: '/valid-url-wink-wink',
          },
          {
            name: 'file number 2.jpg',
            description: 'description for this file',
            downloadUrl: '/url-2',
          },
        ],
      }
    };
    beforeAll(() => {
      global.window = {};
    })
    test('snapshot: with valid response', () => {
      expect(shallow(<ResponseDisplay {...props} />)).toMatchSnapshot();
    });

    test('snapshot: no response', () => {
      expect(shallow(<ResponseDisplay />)).toMatchSnapshot();
    })
  });
  describe('mapStateToProps', () => {
    let mapped;
    const testState = { 
      dummyText: 'text',
      dummyFiles: ['files', 'file-2']
     };
    beforeEach(() => {
      mapped = mapStateToProps(testState);
    });
    test('response loads from grading.selected.response', () => {
      expect(mapped.response).toEqual(selectors.grading.selected.response(testState));
    });
  });
});
