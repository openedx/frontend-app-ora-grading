import React from 'react';
import { shallow } from 'enzyme';

import { selectors } from 'data/redux';
import { DemoWarning, mapStateToProps } from '.';

jest.mock('data/redux', () => ({
  selectors: {
    app: { isEnabled: (args) => ({ isEnabled: args }) },
  },
}));

let el;

describe('DemoWarning component', () => {
  describe('snapshots', () => {
    test('does not render if disabled flag is missing', () => {
      el = shallow(<DemoWarning hide />);
      expect(el).toMatchSnapshot();
      expect(el.isEmptyRender()).toEqual(true);
    });
    test('snapshot: disabled flag is present', () => {
      el = shallow(<DemoWarning hide={false} />);
      expect(el).toMatchSnapshot();
      expect(el.isEmptyRender()).toEqual(false);
    });
  });
  describe('mapStateToProps', () => {
    const testState = { some: 'test-state' };
    test('hide is forwarded from app.isEnabled', () => {
      expect(mapStateToProps(testState).hide).toEqual(
        selectors.app.isEnabled(testState),
      );
    });
  });
});
