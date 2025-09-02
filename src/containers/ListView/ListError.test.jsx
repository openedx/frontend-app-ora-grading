import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { selectors, thunkActions } from 'data/redux';
import { ListError, mapDispatchToProps, mapStateToProps } from './ListError';
import messages from './messages';

jest.unmock('@openedx/paragon');
jest.unmock('react');
jest.unmock('@edx/frontend-platform/i18n');

jest.mock('data/redux', () => ({
  selectors: {
    app: {
      courseId: jest.fn((state) => state.courseId || 'test-course-id'),
    },
  },
  thunkActions: {
    app: {
      initialize: jest.fn(),
    },
  },
}));

jest.mock('data/services/lms/urls', () => ({
  openResponse: (courseId) => `api/openResponse/${courseId}`,
}));

describe('ListError component', () => {
  const props = {
    courseId: 'test-course-id',
    initializeApp: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('behavior', () => {
    it('renders error alert with proper styling', () => {
      render(<IntlProvider locale="en" messages={{}}><ListError {...props} /></IntlProvider>);
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveClass('alert-danger');
    });

    it('displays error heading and message', () => {
      render(<IntlProvider locale="en" messages={{}}><ListError {...props} /></IntlProvider>);
      const heading = screen.getByRole('alert').querySelector('.alert-heading');
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent(messages.loadErrorHeading.defaultMessage);
    });

    it('displays try again button', () => {
      render(<IntlProvider locale="en" messages={{}}><ListError {...props} /></IntlProvider>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('btn-primary');
    });

    it('calls initializeApp when try again button is clicked', async () => {
      render(<IntlProvider locale="en" messages={{}}><ListError {...props} /></IntlProvider>);
      const user = userEvent.setup();
      const button = screen.getByRole('button');
      await user.click(button);
      expect(props.initializeApp).toHaveBeenCalledTimes(1);
    });
  });

  describe('mapStateToProps', () => {
    const testState = { some: 'test-state' };
    it('maps courseId from app.courseId selector', () => {
      const mapped = mapStateToProps(testState);
      expect(mapped.courseId).toEqual(selectors.app.courseId(testState));
    });
  });

  describe('mapDispatchToProps', () => {
    it('maps initializeApp from thunkActions.app.initialize', () => {
      expect(mapDispatchToProps.initializeApp).toEqual(
        thunkActions.app.initialize,
      );
    });
  });
});
