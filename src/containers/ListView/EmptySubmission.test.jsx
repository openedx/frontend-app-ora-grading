import { screen } from '@testing-library/react';
import urls from 'data/services/lms/urls';
import { renderWithIntl } from '../../testUtils';
import EmptySubmission from './EmptySubmission';

jest.mock('data/services/lms/urls', () => ({
  openResponse: (courseId) => `openResponseUrl(${courseId})`,
}));

jest.mock('./assets/empty-state.svg', () => './assets/empty-state.svg');

describe('EmptySubmission component', () => {
  const props = { courseId: 'test-course-id' };

  it('renders the empty state image with correct alt text', () => {
    renderWithIntl(<EmptySubmission {...props} />);
    expect(screen.getByAltText('empty state')).toBeInTheDocument();
  });

  it('renders the no results found title message', () => {
    renderWithIntl(<EmptySubmission {...props} />);
    expect(screen.getByText('Nothing here yet')).toBeInTheDocument();
  });

  it('renders hyperlink with correct destination URL', () => {
    renderWithIntl(<EmptySubmission {...props} />);
    const hyperlink = screen.getByRole('link');
    expect(hyperlink).toHaveAttribute(
      'href',
      urls.openResponse(props.courseId),
    );
  });

  it('renders the back to responses button', () => {
    renderWithIntl(<EmptySubmission {...props} />);
    expect(screen.getByText('Back to all open responses')).toBeInTheDocument();
  });
});
