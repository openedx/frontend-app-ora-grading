import { render, screen, fireEvent } from '@testing-library/react';
import { selectors, thunkActions } from 'data/redux';
import {
  ListError,
  mapDispatchToProps,
  mapStateToProps,
} from './ListError';

jest.unmock('@openedx/paragon');
jest.unmock('react');

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
      const { container } = render(<ListError {...props} />);
      const alert = container.querySelector('.alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveClass('alert-danger');
    });

    it('displays error heading and message', () => {
      const { container } = render(<ListError {...props} />);
      const heading = container.querySelector('.alert-heading');
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('FormattedMessage');
    });

    it('displays try again button', () => {
      render(<ListError {...props} />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('btn-primary');
    });

    it('calls initializeApp when try again button is clicked', () => {
      render(<ListError {...props} />);
      const button = screen.getByRole('button');
      fireEvent.click(button);
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
      expect(mapDispatchToProps.initializeApp).toEqual(thunkActions.app.initialize);
    });
  });
});
