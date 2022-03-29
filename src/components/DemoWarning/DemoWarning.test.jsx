import React from 'react';
import { shallow } from 'enzyme';

import DemoWarning from '.';

let el;

describe('DemoErrors component', () => {
  describe('snapshots', () => {
    const OLD_ENV = process.env;
    beforeAll(() => {
      jest.resetModules();
      process.env = { ...OLD_ENV };
    });
    afterAll(() => {
      process.env = OLD_ENV;
    });
    test('does not render if disabled flag is missing', () => {
      process.env.REACT_APP_NOT_ENABLED = false;
      el = shallow(<DemoWarning />);
      expect(el).toMatchSnapshot();
      expect(el.isEmptyRender()).toEqual(true);
    });
    test('snapshot: disabled flag is present', () => {
      process.env.REACT_APP_NOT_ENABLED = true;
      el = shallow(<DemoWarning />);
      expect(el).toMatchSnapshot();
      expect(el.isEmptyRender()).toEqual(false);
    });
  });
});
