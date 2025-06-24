import { render } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import {
  ReviewContent,
} from './ReviewContent';

jest.unmock('@openedx/paragon');
jest.unmock('react');
jest.unmock('@edx/frontend-platform/i18n');

// Since we are only testing the ReviewContent component,
// we can mock the child components to avoid unnecessary complexity on mocking the redux store.
jest.mock('containers/ReviewModal/ReviewErrors/FetchErrors', () => {
  const FetchErrors = () => <div>FetchErrors</div>;
  return FetchErrors;
});
jest.mock('containers/ReviewModal/ReviewErrors/SubmitErrors', () => {
  const SubmitErrors = () => <div>SubmitErrors</div>;
  return SubmitErrors;
});
jest.mock('containers/ReviewModal/ReviewErrors/LockErrors', () => {
  const LockErrors = () => <div>LockErrors</div>;
  return LockErrors;
});
jest.mock('containers/ReviewModal/ReviewErrors/DownloadErrors', () => {
  const DownloadErrors = () => <div>DownloadErrors</div>;
  return DownloadErrors;
});

jest.mock('containers/ResponseDisplay', () => {
  const ResponseDisplay = () => <div>ResponseDisplay</div>;
  return ResponseDisplay;
});

jest.mock('containers/Rubric', () => {
  const Rubric = () => <div>Rubric</div>;
  return Rubric;
});

jest.mock('data/redux', () => ({
  selectors: {
    app: {
      showRubric: jest.fn(() => true),
    },
    requests: {
      isCompleted: jest.fn(() => false),
      isFailed: jest.fn(() => false),
    },
  },
}));

describe('ReviewContent component', () => {
  const renderWithIntl = (component) => render(
    <IntlProvider locale="en" messages={{}}>
      {component}
    </IntlProvider>,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('behavior', () => {
    it('renders nothing when not loaded and no error', () => {
      const { container } = renderWithIntl(<ReviewContent />);
      expect(container.querySelector('.content-block')).not.toBeInTheDocument();
    });

    it('renders review errors when failed', () => {
      const { getByText } = renderWithIntl(<ReviewContent isFailed />);
      expect(getByText('FetchErrors')).toBeInTheDocument();
    });

    it('renders response display when loaded', () => {
      const { getByText } = renderWithIntl(<ReviewContent isLoaded />);
      expect(getByText('ResponseDisplay')).toBeInTheDocument();
    });

    it('renders with rubric when showRubric is true and loaded', () => {
      const { container, getByText } = renderWithIntl(<ReviewContent isLoaded showRubric />);
      expect(container.querySelector('.content-block')).toBeInTheDocument();
      expect(container.querySelector('.flex-nowrap')).toBeInTheDocument();
      expect(getByText('Rubric')).toBeInTheDocument();
    });
  });
});
