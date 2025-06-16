import { render } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import FilePopoverCell from './FilePopoverCell';

const mockMessages = {
  en: {},
};

const renderWithIntl = (component) => render(
  <IntlProvider locale="en" messages={mockMessages}>
    {component}
  </IntlProvider>,
);

describe('FilePopoverCell', () => {
  const props = {
    row: {
      original: {
        name: 'some file name',
        description: 'long descriptive text...',
        downloadURL: 'this-url-is.working',
        size: 1024,
      },
    },
  };

  it('renders the component without errors', () => {
    const { container } = renderWithIntl(<FilePopoverCell {...props} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders the info icon button', () => {
    const { getByTestId } = renderWithIntl(<FilePopoverCell {...props} />);
    expect(getByTestId('esg-help-icon')).toBeInTheDocument();
  });

  it('info button has correct alt text', () => {
    const { getByTestId } = renderWithIntl(<FilePopoverCell {...props} />);
    const button = getByTestId('esg-help-icon');
    expect(button).toHaveAttribute('alt', 'Display more info');
  });

  it('handles empty row.original object', () => {
    const emptyProps = {
      row: {
        original: {},
      },
    };

    const { container } = renderWithIntl(<FilePopoverCell {...emptyProps} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('handles missing row prop', () => {
    const { container } = renderWithIntl(<FilePopoverCell />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
