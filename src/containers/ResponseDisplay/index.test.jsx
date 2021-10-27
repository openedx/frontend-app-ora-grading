import React from 'react';
import { shallow } from 'enzyme';

import createDOMPurify from 'dompurify';
import parse from 'html-react-parser';

import selectors from 'data/selectors';

import { ResponseDisplay, mapStateToProps } from '.';

// jest.mock('@edx/paragon', () => {
//   const Card = () => 'Card';
//   Card.Body = 'Card.Body';
//   return {
//     Card,
//   };
// });

jest.mock('@edx/paragon', () => {
  const { mockComponents } = jest.requireActual('testUtils');
  return mockComponents('Card', 'Card.Body');
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
jest.mock('dompurify', () => () => ({
  sanitize: (text) => `sanitized (${text})`,
}));
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
      },
    };
    let el;
    beforeAll(() => {
      global.window = {};
      el = shallow(<ResponseDisplay />);
    });

    describe('snapshot', () => {
      test('no response', () => {
        expect(el).toMatchSnapshot();
      });
      test('with valid response', () => {
        el.setProps({ ...props });
        expect(el).toMatchSnapshot();
      });
    });
    describe('behavior', () => {
      test('get textContent', () => {
        expect(el.instance().textContent).toEqual(
          parse(createDOMPurify(window).sanitize(props.response.text)),
        );
      });

      test('get submittedFiles', () => {
        expect(el.instance().submittedFiles).toEqual(props.response.files);
      });
    });
  });
  describe('mapStateToProps', () => {
    let mapped;
    const testState = {
      dummyText: 'text',
      dummyFiles: ['files', 'file-2'],
    };
    beforeEach(() => {
      mapped = mapStateToProps(testState);
    });
    test('response loads from grading.selected.response', () => {
      expect(mapped.response).toEqual(
        selectors.grading.selected.response(testState),
      );
    });
  });
});
