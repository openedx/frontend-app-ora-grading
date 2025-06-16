import { render, screen } from '@testing-library/react';
import { TableAction } from './TableAction';

jest.unmock('@openedx/paragon');
jest.unmock('react');

describe('TableAction component', () => {
  const props = {
    tableInstance: { rows: [{ id: 1 }, { id: 2 }] },
    handleClick: jest.fn(() => () => {}),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders button with correct text', () => {
    render(<TableAction {...props} />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('FormattedMessage');
  });

  it('applies correct CSS class to button', () => {
    render(<TableAction {...props} />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('view-all-responses-btn');
    expect(button).toHaveClass('btn-primary');
  });

  it('enables button when rows are present', () => {
    render(<TableAction {...props} />);
    const button = screen.getByRole('button');
    expect(button).not.toBeDisabled();
  });

  it('disables button when no rows are present', () => {
    const emptyProps = {
      tableInstance: { rows: [] },
      handleClick: jest.fn(() => () => {}),
    };
    render(<TableAction {...emptyProps} />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('calls handleClick with table rows on render', () => {
    render(<TableAction {...props} />);
    expect(props.handleClick).toHaveBeenCalledWith(props.tableInstance.rows);
  });
});
