import { render } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import urls from 'data/services/lms/urls';
import EmptySubmission from './EmptySubmission';

jest.unmock('@openedx/paragon');
jest.unmock('react');
jest.unmock('@edx/frontend-platform/i18n');

jest.mock('data/services/lms/urls', () => ({
  openResponse: (courseId) => `openResponseUrl(${courseId})`,
}));

jest.mock('./assets/empty-state.svg', () => './assets/empty-state.svg');

describe('EmptySubmission component', () => {
  const props = { courseId: 'test-course-id' };

  const renderWithIntl = (component) => render(
    <IntlProvider locale="en" messages={{}}>
      {component}
    </IntlProvider>,
  );

  it('renders the empty state image with correct alt text', () => {
    const { getByAltText } = renderWithIntl(<EmptySubmission {...props} />);
    expect(getByAltText('empty state')).toBeInTheDocument();
  });

  it('renders the no results found title message', () => {
    const { getByText } = renderWithIntl(<EmptySubmission {...props} />);
    expect(getByText('Nothing here yet')).toBeInTheDocument();
  });

  it('renders hyperlink with correct destination URL', () => {
    const { container } = renderWithIntl(<EmptySubmission {...props} />);
    const hyperlink = container.querySelector('a');
    expect(hyperlink).toHaveAttribute('href', urls.openResponse(props.courseId));
  });

  it('renders the back to responses button', () => {
    const { getByText } = renderWithIntl(<EmptySubmission {...props} />);
    expect(getByText('Back to all open responses')).toBeInTheDocument();
  });
});
