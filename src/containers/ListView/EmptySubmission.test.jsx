import React from 'react';
import { shallow } from 'enzyme';

import { Hyperlink } from '@edx/paragon';

import urls from 'data/services/lms/urls';

import EmptySubmission from './EmptySubmission';

jest.mock('data/services/lms/urls', () => ({
  openResponse: (courseId) => `openResponseUrl(${courseId})`,
}));

jest.mock('./assets/emptyState.svg', () => './assets/emptyState.svg');

let el;

describe('EmptySubmission component', () => {
  describe('component', () => {
    const props = { courseId: 'test-course-id' };
    beforeEach(() => {
      el = shallow(<EmptySubmission {...props} />);
    });
    test('snapshot', () => {
      expect(el).toMatchSnapshot();
    });
    test('openResponse destination', () => {
      expect(
        el.find(Hyperlink).at(0).props().destination,
      ).toEqual(urls.openResponse(props.courseId));
    });
  });
});
