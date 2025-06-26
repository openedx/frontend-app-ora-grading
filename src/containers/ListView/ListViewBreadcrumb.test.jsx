import { render } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { selectors } from 'data/redux';
import {
  ListViewBreadcrumb,
  mapStateToProps,
} from './ListViewBreadcrumb';

jest.unmock('@openedx/paragon');
jest.unmock('react');
jest.unmock('@edx/frontend-platform/i18n');

jest.mock('data/redux', () => ({
  selectors: {
    app: {
      courseId: jest.fn((state) => state.courseId || 'test-course-id'),
      ora: {
        name: jest.fn((state) => state.oraName || 'test-ora-name'),
      },
    },
  },
}));

jest.mock('data/services/lms/urls', () => ({
  openResponse: (courseId) => `openResponseUrl(${courseId})`,
  ora: (courseId, locationId) => `oraUrl(${courseId}, ${locationId})`,
}));

jest.mock('data/constants/app', () => ({
  locationId: () => 'test-location-id',
}));

describe('ListViewBreadcrumb component', () => {
  const props = {
    courseId: 'test-course-id',
    oraName: 'fake-ora-name',
  };

  const renderWithIntl = (component) => render(
    <IntlProvider locale="en" messages={{}}>
      {component}
    </IntlProvider>,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('behavior', () => {
    it('renders back to responses link with correct destination', () => {
      const { container } = renderWithIntl(<ListViewBreadcrumb {...props} />);
      const backLink = container.querySelector('a[href*="openResponseUrl"]');
      expect(backLink).toBeInTheDocument();
      expect(backLink).toHaveAttribute('href', `openResponseUrl(${props.courseId})`);
    });

    it('displays ORA name in heading', () => {
      const { getByText } = renderWithIntl(<ListViewBreadcrumb {...props} />);
      const heading = getByText(props.oraName);
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveClass('h3');
    });

    it('renders ORA link with correct destination', () => {
      const { container } = renderWithIntl(<ListViewBreadcrumb {...props} />);
      const oraLink = container.querySelector('a[href*="oraUrl"]');
      expect(oraLink).toBeInTheDocument();
      expect(oraLink).toHaveAttribute('href', `oraUrl(${props.courseId}, test-location-id)`);
    });

    it('displays back to responses text', () => {
      const { getByText } = renderWithIntl(<ListViewBreadcrumb {...props} />);
      expect(getByText('Back to all open responses')).toBeInTheDocument();
    });
  });

  describe('mapStateToProps', () => {
    const testState = { some: 'test-state' };

    it('maps courseId from app.courseId selector', () => {
      const mapped = mapStateToProps(testState);
      expect(mapped.courseId).toEqual(selectors.app.courseId(testState));
    });

    it('maps oraName from app.ora.name selector', () => {
      const mapped = mapStateToProps(testState);
      expect(mapped.oraName).toEqual(selectors.app.ora.name(testState));
    });
  });
});
