import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { RequestKeys, RequestStates } from 'data/constants/requests';
import { selectors, thunkActions } from 'data/redux';
import {
  mapStateToProps,
  mapDispatchToProps,
  FileDownload,
  statusMapping,
} from './FileDownload';
import messages from './messages';

jest.mock('data/redux', () => ({
  selectors: {
    requests: { requestStatus: jest.fn((state, { requestKey }) => ({ status: 'inactive', requestKey })) },
  },
  thunkActions: {
    download: { downloadFiles: jest.fn() },
  },
}));

describe('FileDownload', () => {
  const defaultProps = {
    requestStatus: { status: RequestStates.inactive },
    downloadFiles: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('behavior', () => {
    it('renders StatefulButton with default state when inactive', () => {
      render(<IntlProvider locale="en" messages={{}}><FileDownload {...defaultProps} /></IntlProvider>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent(messages.downloadFiles.defaultMessage);
    });

    it('renders with pending state when download is pending', () => {
      const props = { ...defaultProps, requestStatus: { status: RequestStates.pending } };
      render(<IntlProvider locale="en" messages={{}}><FileDownload {...props} /></IntlProvider>);
      const button = screen.getByRole('button');
      screen.debug();
      expect(button).toHaveClass('pgn__stateful-btn-state-pending');
      expect(button).toHaveAttribute('aria-disabled', 'true');
      expect(button).toHaveTextContent(messages.downloading.defaultMessage);
    });

    it('renders with completed state when download is completed', () => {
      const props = { ...defaultProps, requestStatus: { status: RequestStates.completed } };
      render(<IntlProvider locale="en" messages={{}}><FileDownload {...props} /></IntlProvider>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('pgn__stateful-btn-state-completed');
    });

    it('renders with failed state when download fails', () => {
      const props = { ...defaultProps, requestStatus: { status: RequestStates.failed } };
      render(<IntlProvider locale="en" messages={{}}><FileDownload {...props} /></IntlProvider>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('pgn__stateful-btn-state-failed');
      expect(button).toHaveTextContent(messages.retryDownload.defaultMessage);
    });

    it('calls downloadFiles when button is clicked', async () => {
      render(<IntlProvider locale="en" messages={{}}><FileDownload {...defaultProps} /></IntlProvider>);
      const user = userEvent.setup();
      const button = screen.getByRole('button');
      await user.click(button);
      expect(defaultProps.downloadFiles).toHaveBeenCalledTimes(1);
    });

    it('maps request states to button states correctly', () => {
      expect(statusMapping[RequestStates.inactive]).toBe('default');
      expect(statusMapping[RequestStates.pending]).toBe('pending');
      expect(statusMapping[RequestStates.completed]).toBe('completed');
      expect(statusMapping[RequestStates.failed]).toBe('failed');
    });
  });

  describe('mapStateToProps', () => {
    const testState = { some: 'test-state' };

    it('maps requestStatus from requests.requestStatus selector', () => {
      const mapped = mapStateToProps(testState);
      const expectedResult = selectors.requests.requestStatus(testState, { requestKey: RequestKeys.downloadFiles });
      expect(mapped.requestStatus).toEqual(expectedResult);
    });
  });

  describe('mapDispatchToProps', () => {
    it('maps downloadFiles from thunkActions', () => {
      expect(mapDispatchToProps.downloadFiles).toEqual(thunkActions.download.downloadFiles);
    });
  });
});
