import { render, screen } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { SelectedBulkAction } from './SelectedBulkAction';

jest.unmock('@openedx/paragon');
jest.unmock('react');
jest.unmock('@edx/frontend-platform/i18n');

describe('SelectedBulkAction component', () => {
  const props = {
    selectedFlatRows: [{ id: 1 }, { id: 2 }],
    handleClick: jest.fn(() => () => {}),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders button with correct text and selected count', () => {
    render(<IntlProvider locale="en" messages={{}}><SelectedBulkAction {...props} /></IntlProvider>);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(`View selected responses (${props.selectedFlatRows.length})`);
  });

  it('applies correct CSS class to button', () => {
    render(<IntlProvider locale="en" messages={{}}><SelectedBulkAction {...props} /></IntlProvider>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('view-selected-responses-btn');
    expect(button).toHaveClass('btn-primary');
  });

  it('calls handleClick with selectedFlatRows on render', () => {
    render(<IntlProvider locale="en" messages={{}}><SelectedBulkAction {...props} /></IntlProvider>);
    expect(props.handleClick).toHaveBeenCalledWith(props.selectedFlatRows);
  });
});
