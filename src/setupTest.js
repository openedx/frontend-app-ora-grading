/* eslint-disable import/no-extraneous-dependencies */
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

jest.mock('@edx/frontend-platform/i18n', () => {
  const i18n = jest.requireActual('@edx/frontend-platform/i18n');
  return {
    ...i18n,
    intlShape: jest.requireActual('prop-types').shape({
      formatMessage: jest.fn(msg => msg.defaultMessage),
    }),
    defineMessages: m => m,
    FormattedMessage: () => 'FormattedMessage',
  };
});
