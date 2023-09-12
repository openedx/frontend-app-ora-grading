/* eslint-disable import/no-extraneous-dependencies */
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';

import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

Enzyme.configure({ adapter: new Adapter() });

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useRef: jest.fn((val) => ({ current: val, useRef: true })),
  useCallback: jest.fn((cb, prereqs) => ({ useCallback: { cb, prereqs } })),
  useEffect: jest.fn((cb, prereqs) => ({ useEffect: { cb, prereqs } })),
  useContext: jest.fn(context => context),
}));

jest.mock('@edx/frontend-platform/i18n', () => {
  const i18n = jest.requireActual('@edx/frontend-platform/i18n');
  const PropTypes = jest.requireActual('prop-types');
  const { formatMessage } = jest.requireActual('./testUtils');
  const formatDate = jest.fn(date => new Date(date).toLocaleDateString()).mockName('useIntl.formatDate');
  return {
    ...i18n,
    intlShape: PropTypes.shape({
      formatMessage: PropTypes.func,
    }),
    useIntl: () => ({
      formatMessage,
      formatDate,
    }),
    defineMessages: m => m,
    FormattedMessage: () => 'FormattedMessage',
  };
});

jest.mock('@edx/paragon', () => jest.requireActual('testUtils').mockNestedComponents({
  Alert: {
    Heading: 'Alert.Heading',
  },
  AlertModal: 'AlertModal',
  ActionRow: 'ActionRow',
  Badge: 'Badge',
  Button: 'Button',
  Card: {
    Body: 'Card.Body',
    Section: 'Card.Section',
    Footer: 'Card.Footer',
  },
  Col: 'Col',
  Collapsible: {
    Advanced: 'Collapsible.Advanced',
    Body: 'Collapsible.Body',
    Trigger: 'Collapsible.Trigger',
    Visible: 'Collapsible.Visible',
  },
  Container: 'Container',
  DataTable: {
    EmptyTable: 'DataTable.EmptyTable',
    Table: 'DataTable.Table',
    TableControlBar: 'DataTable.TableControlBar',
    TableController: 'DataTable.TableController',
    TableFooter: 'DataTable.TableFooter',
  },
  Dropdown: {
    Item: 'Dropdown.Item',
    Menu: 'Dropdown.Menu',
    Toggle: 'Dropdown.Toggle',
  },
  Form: {
    Control: {
      Feedback: 'Form.Control.Feedback',
    },
    Group: 'Form.Group',
    Label: 'Form.Label',
    Radio: 'Form.Radio',
    RadioSet: 'Form.RadioSet',
  },
  FormControlFeedback: 'FormControlFeedback',
  FullscreenModal: 'FullscreenModal',
  Hyperlink: 'Hyperlink',
  Icon: 'Icon',
  IconButton: 'IconButton',
  MultiSelectDropdownFilter: 'MultiSelectDropdownFilter',
  OverlayTrigger: 'OverlayTrigger',
  PageBanner: 'PageBanner',
  Popover: {
    Content: 'Popover.Content',
  },
  Row: 'Row',
  StatefulButton: 'StatefulButton',
  TextFilter: 'TextFilter',
  Spinner: 'Spinner',
}));

jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: 'FontAwesomeIcon',
}));
jest.mock('@fortawesome/free-solid-svg-icons', () => ({
  faUserCircle: jest.fn().mockName('fa-user-circle-icon'),
}));

jest.mock('@edx/paragon/icons', () => ({
  ArrowBack: jest.fn().mockName('icons.ArrowBack'),
  ArrowDropDown: jest.fn().mockName('icons.ArrowDropDown'),
  ArrowDropUp: jest.fn().mockName('icons.ArrowDropUp'),
  Cancel: jest.fn().mockName('icons.Cancel'),
  ChevronLeft: jest.fn().mockName('icons.ChevronLeft'),
  ChevronRight: jest.fn().mockName('icons.ChevronRight'),
  Highlight: jest.fn().mockName('icons.Highlight'),
  InfoOutline: jest.fn().mockName('icons.InfoOutline'),
  Launch: jest.fn().mockName('icons.Launch'),
}));

jest.mock('data/constants/app', () => ({
  locationId: () => 'fake-location-id',
}));

jest.mock('hooks', () => ({
  ...jest.requireActual('hooks'),
  nullMethod: jest.fn().mockName('hooks.nullMethod'),
}));

jest.mock('@zip.js/zip.js', () => ({}));

// Mock react-redux hooks
// unmock for integration tests
jest.mock('react-redux', () => {
  const dispatch = jest.fn((...args) => ({ dispatch: args })).mockName('react-redux.dispatch');
  return {
    connect: (mapStateToProps, mapDispatchToProps) => (component) => ({
      mapStateToProps,
      mapDispatchToProps,
      component,
    }),
    useDispatch: jest.fn(() => dispatch),
    useSelector: jest.fn((selector) => ({ useSelector: selector })),
  };
});
