import { screen } from '@testing-library/react';
import { gradingStatuses } from 'data/services/lms/constants';
import messages from '../data/services/lms/messages';
import { renderWithIntl } from '../testUtils';
import { StatusBadge } from './StatusBadge';

const className = 'test-className';
describe('StatusBadge component', () => {
  describe('behavior', () => {
    it('does not render if status does not have configured variant', () => {
      const { container } = renderWithIntl(<StatusBadge className={className} status="arbitrary" />);
      expect(container.firstChild).toBeNull();
    });
    describe('status rendering: loads badge with configured variant and message', () => {
      it('`ungraded` shows primary button variant and message', () => {
        renderWithIntl(<StatusBadge className={className} status={gradingStatuses.ungraded} />);
        const badge = screen.getByText(messages.ungraded.defaultMessage);
        expect(badge).toHaveClass('badge-primary');
      });
      it('`locked` shows light button variant and message', () => {
        renderWithIntl(<StatusBadge className={className} status={gradingStatuses.locked} />);
        const badge = screen.getByText(messages.locked.defaultMessage);
        expect(badge).toHaveClass('badge-light');
      });
      it('`graded` shows success button variant and message', () => {
        renderWithIntl(<StatusBadge className={className} status={gradingStatuses.graded} />);
        const badge = screen.getByText(messages.graded.defaultMessage);
        expect(badge).toHaveClass('badge-success');
      });
      it('`inProgress` shows warning button variant and message', () => {
        renderWithIntl(<StatusBadge className={className} status={gradingStatuses.inProgress} />);
        const badge = screen.getByText(messages['in-progress'].defaultMessage);
        expect(badge).toHaveClass('badge-warning');
      });
    });
  });
});
