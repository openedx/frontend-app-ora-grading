import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { selectors, actions, thunkActions } from 'data/redux';
import { RequestKeys } from 'data/constants/requests';
import { DownloadErrors, mapStateToProps, mapDispatchToProps } from './DownloadErrors';

jest.unmock('@openedx/paragon');
jest.unmock('react');
jest.unmock('@edx/frontend-platform/i18n');

jest.mock('data/redux', () => ({
  selectors: {
    requests: {
      isFailed: jest.fn((state) => state.isFailed || false),
      error: jest.fn((state) => state.error || { files: [] }),
    },
  },
  actions: {
    requests: { clearRequest: jest.fn() },
  },
  thunkActions: {
    download: { downloadFiles: jest.fn() },
  },
}));

const renderWithIntl = (component) => render(
  <IntlProvider locale="en" messages={{}}>
    {component}
  </IntlProvider>,
);

describe('DownloadErrors component', () => {
  const defaultProps = {
    isFailed: false,
    error: { files: [] },
    clearState: jest.fn(),
    downloadFiles: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when isFailed is false', () => {
    const { container } = renderWithIntl(<DownloadErrors {...defaultProps} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render error message when isFailed is true', () => {
    const props = {
      ...defaultProps,
      isFailed: true,
      error: { files: ['file-1-failed.error', 'file-2.failed'] },
    };
    const { getByText } = renderWithIntl(<DownloadErrors {...props} />);
    expect(getByText("Couldn't download files")).toBeInTheDocument();
  });

  it('should display list of failed files', () => {
    const props = {
      ...defaultProps,
      isFailed: true,
      error: { files: ['file-1-failed.error', 'file-2.failed'] },
    };
    const { getByText } = renderWithIntl(<DownloadErrors {...props} />);
    expect(getByText('file-1-failed.error')).toBeInTheDocument();
    expect(getByText('file-2.failed')).toBeInTheDocument();
  });

  it('should call clearState when dismiss button is clicked', async () => {
    const props = {
      ...defaultProps,
      isFailed: true,
      error: { files: ['test-file.error'] },
    };
    renderWithIntl(<DownloadErrors {...props} />);
    const user = userEvent.setup();
    await user.click(screen.getByText('Dismiss'));
    expect(props.clearState).toHaveBeenCalledWith({ requestKey: RequestKeys.downloadFiles });
  });

  it('should call downloadFiles when retry button is clicked', async () => {
    const props = {
      ...defaultProps,
      isFailed: true,
      error: { files: ['test-file.error'] },
    };
    renderWithIntl(<DownloadErrors {...props} />);
    const user = userEvent.setup();
    await user.click(screen.getByText('Retry download'));
    expect(props.downloadFiles).toHaveBeenCalled();
  });

  describe('mapStateToProps', () => {
    it('should map isFailed from requests selector', () => {
      const testState = { some: 'test-state' };
      const mapped = mapStateToProps(testState);
      expect(selectors.requests.isFailed).toHaveBeenCalledWith(testState, { requestKey: RequestKeys.downloadFiles });
      expect(mapped.isFailed).toEqual(
        selectors.requests.isFailed(testState, { requestKey: RequestKeys.downloadFiles }),
      );
    });

    it('should map error from requests selector', () => {
      const testState = { some: 'test-state' };
      const mapped = mapStateToProps(testState);
      expect(selectors.requests.error).toHaveBeenCalledWith(testState, { requestKey: RequestKeys.downloadFiles });
      expect(mapped.error).toEqual(
        selectors.requests.error(testState, { requestKey: RequestKeys.downloadFiles }),
      );
    });
  });

  describe('mapDispatchToProps', () => {
    it('should map clearState to actions.requests.clearRequest', () => {
      expect(mapDispatchToProps.clearState).toEqual(actions.requests.clearRequest);
    });

    it('should map downloadFiles to thunkActions.download.downloadFiles', () => {
      expect(mapDispatchToProps.downloadFiles).toEqual(thunkActions.download.downloadFiles);
    });
  });
});
