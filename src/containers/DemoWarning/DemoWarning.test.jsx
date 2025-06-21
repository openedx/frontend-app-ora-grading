import { render } from '@testing-library/react';
import { selectors } from 'data/redux';
import { DemoWarning, mapStateToProps } from '.';

jest.unmock('@openedx/paragon');
jest.unmock('react');

jest.mock('data/redux', () => ({
  selectors: {
    app: { isEnabled: (args) => ({ isEnabled: args }) },
  },
}));

describe('DemoWarning component', () => {
  describe('behavior', () => {
    it('does not render when hide prop is true', () => {
      const { container } = render(<DemoWarning hide />);
      expect(container.firstChild).toBeNull();
    });

    it('renders alert with warning message when hide prop is false', () => {
      const { getByRole } = render(<DemoWarning hide={false} />);
      const alert = getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveClass('alert-warning');
    });
  });

  describe('mapStateToProps', () => {
    it('maps hide prop from app.isEnabled selector', () => {
      const testState = { some: 'test-state' };
      expect(mapStateToProps(testState).hide).toEqual(
        selectors.app.isEnabled(testState),
      );
    });
  });
});
