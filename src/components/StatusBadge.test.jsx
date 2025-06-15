import { render } from '@testing-library/react';
import { gradingStatuses } from 'data/services/lms/constants';
import { StatusBadge } from './StatusBadge';

jest.unmock('@openedx/paragon');
jest.unmock('react');

const className = 'test-className';
describe('StatusBadge component', () => {
  describe('behavior', () => {
    it('does not render if status does not have configured variant', () => {
      const { container } = render(<StatusBadge className={className} status="arbitrary" />);
      expect(container.firstChild).toBeNull();
    });
    describe('status rendering: loads badge with configured variant and message', () => {
      it('`ungraded` shows primary button variant and message', () => {
        const { getByText } = render(<StatusBadge className={className} status={gradingStatuses.ungraded} />);
        const badge = getByText('FormattedMessage');
        expect(badge).toHaveClass('badge-primary');
      });
      it('`locked` shows light button variant and message', () => {
        const { getByText } = render(<StatusBadge className={className} status={gradingStatuses.locked} />);
        const badge = getByText('FormattedMessage');
        expect(badge).toHaveClass('badge-light');
      });
      it('`graded` shows success button variant and message', () => {
        const { getByText } = render(<StatusBadge className={className} status={gradingStatuses.graded} />);
        const badge = getByText('FormattedMessage');
        expect(badge).toHaveClass('badge-success');
      });
      it('`inProgress` shows warning button variant and message', () => {
        const { getByText } = render(<StatusBadge className={className} status={gradingStatuses.inProgress} />);
        const badge = getByText('FormattedMessage');
        expect(badge).toHaveClass('badge-warning');
      });
    });
  });
});
