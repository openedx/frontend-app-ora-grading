/* eslint-disable import/no-extraneous-dependencies */
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import AppProvider from '@edx/frontend-platform/react/AppProvider';
import { IntlProvider } from 'react-intl';
import { render as rtlRender } from '@testing-library/react';
import PropTypes from 'prop-types';

import { getConfig, mergeConfig } from '@edx/frontend-platform';
import { configure as configureAuth, MockAuthService } from '@edx/frontend-platform/auth';
import { configure as configureI18n } from '@edx/frontend-platform/i18n';

import appMessages from './i18n';
import { messages as footerMessages } from '@edx/frontend-component-footer';

Enzyme.configure({ adapter: new Adapter() });

jest.mock('@edx/frontend-platform/i18n', () => {
  const i18n = jest.requireActual('@edx/frontend-platform/i18n');
  const PropTypes = jest.requireActual('prop-types');
  return {
    ...i18n,
    intlShape: PropTypes.shape({
      formatMessage: jest.fn(msg => msg.defaultMessage),
    }),
    defineMessages: m => m,
    FormattedMessage: () => 'FormattedMessage',
  };
});

export const authenticatedUser = {
  userId: 'abc123',
  username: 'Mock User',
  roles: [],
  administrator: false,
};

export function initializeMockApp() {
  mergeConfig({
    CONTACT_URL: process.env.CONTACT_URL || null,
    INSIGHTS_BASE_URL: process.env.INSIGHTS_BASE_URL || null,
    STUDIO_BASE_URL: process.env.STUDIO_BASE_URL || null,
    TWITTER_URL: process.env.TWITTER_URL || null,
    authenticatedUser: {
      userId: 'abc123',
      username: 'Mock User',
      roles: [],
      administrator: false,
    },
    SUPPORT_URL_ID_VERIFICATION: 'http://example.com',
  });

  const authService = configureAuth(MockAuthService, {
    config: getConfig()
  });

  // i18n doesn't have a service class to return.
  configureI18n({
    config: getConfig(),
    messages: [appMessages, footerMessages],
    requireAuthenticatedUser: true,
  });

  return { authService };
}



function render(
  ui,
  {
    store = null,
    ...renderOptions
  } = {},
) {
  function Wrapper({ children }) {
    return (
      // eslint-disable-next-line react/jsx-filename-extension
      <IntlProvider locale="en">
        <AppProvider store={store || {}}>
          {children}
        </AppProvider>
      </IntlProvider>
    );
  }

  Wrapper.propTypes = {
    children: PropTypes.node.isRequired,
  };

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// Re-export everything.
export * from '@testing-library/react';

// Override `render` method.
export {
  render,
};
