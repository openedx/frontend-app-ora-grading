import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';

import { gradingStatuses } from 'data/services/lms/constants';
import { StatusBadge } from './StatusBadge';

const className = 'test-className';
describe('StatusBadge component', () => {
  const render = (status) => shallow(<StatusBadge className={className} status={status} />);
  describe('behavior', () => {
    it('does not render if status does not have configured variant', () => {
      const el = render('arbitrary');
      expect(el.snapshot).toMatchSnapshot();
      expect(el.isEmptyRender()).toEqual(true);
    });
    describe('status snapshots: loads badge with configured variant and message.', () => {
      test('`ungraded` shows primary button variant and message', () => {
        const el = render(gradingStatuses.ungraded);
        expect(el.snapshot).toMatchSnapshot();
      });
      test('`locked` shows light button variant and message', () => {
        const el = render(gradingStatuses.locked);
        expect(el.snapshot).toMatchSnapshot();
      });
      test('`graded` shows success button variant and message', () => {
        const el = render(gradingStatuses.graded);
        expect(el.snapshot).toMatchSnapshot();
      });
      test('`inProgress` shows warning button variant and message', () => {
        const el = render(gradingStatuses.inProgress);
        expect(el.snapshot).toMatchSnapshot();
      });
    });
  });
});
