import React from 'react';
import { shallow } from 'enzyme';

import { formatMessage } from 'testUtils';

import * as hooks from './hooks';
import { Rubric } from '.';

jest.mock('containers/CriterionContainer', () => 'CriterionContainer');
jest.mock('./RubricFeedback', () => 'RubricFeedback');
jest.mock('components/DemoAlert', () => 'DemoAlert');
jest.mock('./hooks', () => ({
  rendererHooks: jest.fn(),
  ButtonStates: jest.requireActual('./hooks').ButtonStates,
}));

describe('Rubric Container', () => {
  const props = {
    intl: { formatMessage },
  };
  const hookProps = {
    criteria: [
      { prop: 'hook-criteria-props-1', key: 1 },
      { prop: 'hook-criteria-props-2', key: 2 },
      { prop: 'hook-criteria-props-3', key: 3 },
    ],
    showFooter: false,
    buttonProps: { prop: 'hook-button-props' },
    demoAlertProps: { prop: 'demo-alert-props' },
  };
  test('snapshot: show footer', () => {
    hooks.rendererHooks.mockReturnValueOnce({ ...hookProps, showFooter: true });
    expect(shallow(<Rubric {...props} />)).toMatchSnapshot();
  });
  test('shapshot: hide footer', () => {
    hooks.rendererHooks.mockReturnValueOnce(hookProps);
    expect(shallow(<Rubric {...props} />)).toMatchSnapshot();
  });
});
