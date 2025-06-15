import { render } from '@testing-library/react';
import { Helmet } from 'react-helmet';
import Head from '.';

jest.mock('@edx/frontend-platform/i18n', () => ({
  useIntl: () => ({
    formatMessage: (message, values) => {
      if (message.defaultMessage && values) {
        return message.defaultMessage.replace('{siteName}', values.siteName);
      }
      return message.defaultMessage || message.id;
    },
  }),
  defineMessages: (messages) => messages,
}));

jest.mock('react-helmet', () => ({
  Helmet: jest.fn(),
}));

Helmet.mockImplementation(({ children }) => <div data-testid="helmet-mock">{children}</div>);

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn().mockReturnValue({
    SITE_NAME: 'site-name',
    FAVICON_URL: 'favicon-url',
  }),
}));

jest.unmock('@openedx/paragon');
jest.unmock('react');

describe('Head', () => {
  it('should render page title with site name from config', () => {
    const { container } = render(<Head />);
    const titleElement = container.querySelector('title');
    expect(titleElement).toBeInTheDocument();
    expect(titleElement.textContent).toContain('ORA staff grading | site-name');
  });

  it('should render favicon link with URL from config', () => {
    const { container } = render(<Head />);
    const faviconLink = container.querySelector('link[rel="shortcut icon"]');
    expect(faviconLink).toBeInTheDocument();
    expect(faviconLink.getAttribute('href')).toEqual('favicon-url');
    expect(faviconLink.getAttribute('type')).toEqual('image/x-icon');
  });
});
