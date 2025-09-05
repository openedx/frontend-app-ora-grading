import { screen } from '@testing-library/react';
import { renderWithIntl } from '../../testUtils';
import { SelectedBulkAction } from './SelectedBulkAction';

describe('SelectedBulkAction component', () => {
  const props = {
    selectedFlatRows: [{ id: 1 }, { id: 2 }],
    handleClick: jest.fn(() => () => {}),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders button with correct text and selected count', () => {
    renderWithIntl(<SelectedBulkAction {...props} />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(`View selected responses (${props.selectedFlatRows.length})`);
  });

  it('applies correct CSS class to button', () => {
    renderWithIntl(<SelectedBulkAction {...props} />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('view-selected-responses-btn');
    expect(button).toHaveClass('btn-primary');
  });

  it('calls handleClick with selectedFlatRows on render', () => {
    renderWithIntl(<SelectedBulkAction {...props} />);
    expect(props.handleClick).toHaveBeenCalledWith(props.selectedFlatRows);
  });
});
