import { render } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { ReviewErrors } from '.';

jest.unmock('@openedx/paragon');
jest.unmock('react');
jest.unmock('@edx/frontend-platform/i18n');

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(() => jest.fn()),
  useSelector: jest.fn((selector) => selector({
    requests: { isFailed: false, error: null, errorStatus: null },
    grading: { isLocked: false },
  })),
  connect: (mapStateToProps, mapDispatchToProps) => (Component) => {
    const MockedComponent = (props) => {
      const mockState = {};
      const mockDispatch = jest.fn();
      const stateProps = mapStateToProps ? mapStateToProps(mockState) : {};
      let dispatchProps = {};
      if (mapDispatchToProps) {
        if (typeof mapDispatchToProps === 'function') {
          dispatchProps = mapDispatchToProps(mockDispatch);
        } else {
          dispatchProps = mapDispatchToProps;
        }
      }
      return <Component {...props} {...stateProps} {...dispatchProps} />;
    };
    return MockedComponent;
  },
}));

jest.mock('data/redux', () => ({
  selectors: {
    requests: {
      isFailed: jest.fn(() => false),
      error: jest.fn(() => null),
      errorStatus: jest.fn(() => null),
    },
    grading: {
      selected: {
        isLocked: jest.fn(() => false),
      },
    },
  },
  thunkActions: {
    app: {
      initialize: jest.fn(),
    },
    grading: {
      loadSubmission: jest.fn(),
      submitResponse: jest.fn(),
    },
    download: {
      downloadFiles: jest.fn(),
    },
  },
  actions: {
    requests: {
      clearRequest: jest.fn(),
    },
  },
}));

const renderWithIntl = (component) => render(
  <IntlProvider locale="en" messages={{}}>
    {component}
  </IntlProvider>,
);

describe('ReviewErrors component', () => {
  it('renders without errors', () => {
    const { container } = renderWithIntl(<ReviewErrors />);
    expect(container).toBeInTheDocument();
  });
});
