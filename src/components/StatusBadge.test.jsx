import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';

import { gradingStatuses } from 'data/services/lms/constants';
import { StatusBadge } from './StatusBadge';

const className = 'test-className';
describe('StatusBadge component', () => {
  const render = (status, title) => shallow(<StatusBadge className={className} status={status} title={title} />);
  describe('behavior', () => {
    it('does not render if status does not have configured variant', () => {
      const el = render('arbitrary');
      expect(el.snapshot).toMatchSnapshot();
      expect(el.isEmptyRender()).toEqual(true);
    });
    it('renders the title when title prop is passed', () => {
      const title = 'Custom Title';
      const wrapper = render('graded', title);

      expect(wrapper.find('Badge').exists()).toBe(true);
      expect(wrapper.find('Badge').prop('variant')).toBe('success');
      expect(wrapper.text()).toContain(title);
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
