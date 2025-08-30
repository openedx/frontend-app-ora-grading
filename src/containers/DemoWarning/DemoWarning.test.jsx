import { render, screen } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { selectors } from 'data/redux';
import { DemoWarning, mapStateToProps } from '.';
import messages from './messages';

jest.unmock('@openedx/paragon');
jest.unmock('react');
jest.unmock('@edx/frontend-platform/i18n');

jest.mock('data/redux', () => ({
  selectors: {
    app: { isEnabled: (args) => ({ isEnabled: args }) },
  },
}));

describe('DemoWarning component', () => {
  describe('behavior', () => {
    it('does not render when hide prop is true', () => {
      const { container } = render(<IntlProvider locale="en"><DemoWarning hide /></IntlProvider>);
      expect(container.firstChild).toBeNull();
    });

    it('renders alert with warning message when hide prop is false', () => {
      render(<IntlProvider locale="en"><DemoWarning hide={false} /></IntlProvider>);
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveClass('alert-warning');
      expect(alert).toHaveTextContent(messages.demoModeMessage.defaultMessage);
      expect(alert).toHaveTextContent(messages.demoModeHeading.defaultMessage);
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
