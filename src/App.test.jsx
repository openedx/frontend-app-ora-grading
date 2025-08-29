import { render, screen } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { selectors } from 'data/redux';
import { App, mapStateToProps } from './App';

jest.unmock('react');
jest.unmock('@openedx/paragon');
jest.unmock('@edx/frontend-platform/i18n');

// we want to scope these tests to the App component, so we mock some child components to reduce complexity

jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedHttpClient: jest.fn(),
  getLoginRedirectUrl: jest.fn(),
}));

jest.mock('@edx/frontend-component-footer', () => ({
  FooterSlot: () => <div data-testid="footer">Footer</div>,
}));

jest.mock('containers/ListView', () => function ListView() {
  return <div data-testid="list-view">List View</div>;
});

jest.mock('containers/DemoWarning', () => function DemoWarning() {
  return <div role="alert" data-testid="demo-warning">Demo Warning</div>;
});

jest.mock('data/redux', () => ({
  selectors: {
    app: {
      courseMetadata: jest.fn((state) => state.courseMetadata || {
        org: 'test-org',
        number: 'test-101',
        title: 'Test Course',
      }),
      isEnabled: jest.fn((state) => (state.isEnabled !== undefined ? state.isEnabled : true)),
    },
  },
}));

const renderWithIntl = (component) => render(
  <IntlProvider locale="en" messages={{}}>
    {component}
  </IntlProvider>,
);

describe('App component', () => {
  const defaultProps = {
    courseMetadata: {
      org: 'test-org',
      number: 'test-101',
      title: 'Test Course',
    },
    isEnabled: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders header with course metadata', () => {
    renderWithIntl(<App {...defaultProps} />);
    screen.debug();
    const org = screen.getByText((text) => text.includes('test-org'));
    expect(org).toBeInTheDocument();
    const title = screen.getByText('Test Course');
    expect(title).toBeInTheDocument();
  });

  it('renders main content', () => {
    renderWithIntl(<App {...defaultProps} />);

    const main = screen.getByTestId('main');
    expect(main).toBeInTheDocument();
  });

  it('does not render demo warning when enabled', () => {
    renderWithIntl(<App {...defaultProps} />);

    const demoWarning = screen.queryByRole('alert');
    expect(demoWarning).not.toBeInTheDocument();
  });

  it('renders demo warning when disabled', () => {
    renderWithIntl(<App {...defaultProps} isEnabled={false} />);

    const demoWarning = screen.getByRole('alert');
    expect(demoWarning).toBeInTheDocument();
  });

  describe('mapStateToProps', () => {
    it('maps state properties correctly', () => {
      const testState = { arbitraryState: 'some data' };
      const mapped = mapStateToProps(testState);

      expect(selectors.app.courseMetadata).toHaveBeenCalledWith(testState);
      expect(selectors.app.isEnabled).toHaveBeenCalledWith(testState);
      expect(mapped.courseMetadata).toEqual(selectors.app.courseMetadata(testState));
      expect(mapped.isEnabled).toEqual(selectors.app.isEnabled(testState));
    });
  });
});
