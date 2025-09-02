import { render, screen } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { TableAction } from './TableAction';
import messages from './messages';

jest.unmock('@openedx/paragon');
jest.unmock('react');
jest.unmock('@edx/frontend-platform/i18n');

describe('TableAction component', () => {
  const props = {
    tableInstance: { rows: [{ id: 1 }, { id: 2 }] },
    handleClick: jest.fn(() => () => {}),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders button with correct text', () => {
    render(<IntlProvider locale="en" messages={{}}><TableAction {...props} /></IntlProvider>);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(messages.viewAllResponses.defaultMessage);
  });

  it('applies correct CSS class to button', () => {
    render(<IntlProvider locale="en" messages={{}}><TableAction {...props} /></IntlProvider>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('view-all-responses-btn');
    expect(button).toHaveClass('btn-primary');
  });

  it('enables button when rows are present', () => {
    render(<IntlProvider locale="en" messages={{}}><TableAction {...props} /></IntlProvider>);
    const button = screen.getByRole('button');
    expect(button).not.toBeDisabled();
  });

  it('disables button when no rows are present', () => {
    const emptyProps = {
      tableInstance: { rows: [] },
      handleClick: jest.fn(() => () => {}),
    };
    render(<IntlProvider locale="en" messages={{}}><TableAction {...emptyProps} /></IntlProvider>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('calls handleClick with table rows on render', () => {
    render(<IntlProvider locale="en" messages={{}}><TableAction {...props} /></IntlProvider>);
    expect(props.handleClick).toHaveBeenCalledWith(props.tableInstance.rows);
  });
});
