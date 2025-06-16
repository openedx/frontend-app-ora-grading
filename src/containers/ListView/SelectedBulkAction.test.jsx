import { render, screen } from '@testing-library/react';
import { SelectedBulkAction } from './SelectedBulkAction';

jest.unmock('@openedx/paragon');
jest.unmock('react');

describe('SelectedBulkAction component', () => {
  const props = {
    selectedFlatRows: [{ id: 1 }, { id: 2 }],
    handleClick: jest.fn(() => () => {}),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders button with correct text and selected count', () => {
    render(<SelectedBulkAction {...props} />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('FormattedMessage');
  });

  it('applies correct CSS class to button', () => {
    render(<SelectedBulkAction {...props} />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('view-selected-responses-btn');
    expect(button).toHaveClass('btn-primary');
  });

  it('calls handleClick with selectedFlatRows on render', () => {
    render(<SelectedBulkAction {...props} />);
    expect(props.handleClick).toHaveBeenCalledWith(props.selectedFlatRows);
  });
});
