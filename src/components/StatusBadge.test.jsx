import React from 'react';
import { shallow } from 'enzyme';

import { gradingStatuses } from 'data/services/lms/constants';
import { StatusBadge } from './StatusBadge';

const className = 'test-className';
describe('StatusBadge component', () => {
  const render = (status) => shallow(<StatusBadge className={className} status={status} />);
  describe('behavior', () => {
    it('does not render if status does not have configured variant', () => {
      const el = render('arbitrary');
      expect(el).toMatchSnapshot();
      expect(el.isEmptyRender()).toEqual(true);
    });
    describe('status snapshots: loads badge with configured variant and message.', () => {
      test('`ungraded` shows primary button variant and message', () => {
        const el = render(gradingStatuses.ungraded);
        expect(el).toMatchSnapshot();
      });
      test('`locked` shows light button variant and message', () => {
        const el = render(gradingStatuses.locked);
        expect(el).toMatchSnapshot();
      });
      test('`graded` shows success button variant and message', () => {
        const el = render(gradingStatuses.graded);
        expect(el).toMatchSnapshot();
      });
      test('`inProgress` shows warning button variant and message', () => {
        const el = render(gradingStatuses.inProgress);
        expect(el).toMatchSnapshot();
      });
    });
  });
});
