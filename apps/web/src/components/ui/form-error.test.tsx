import { render, screen } from '@testing-library/react';
import { FormError } from './form-error';

describe('FormError Component', () => {
  it('renders error message', () => {
    render(<FormError message="This is an error" />);
    expect(screen.getByText('This is an error')).toBeInTheDocument();
  });

  it('has alert role', () => {
    render(<FormError message="Error" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('displays icon', () => {
    const { container } = render(<FormError message="Error" />);
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies correct styling', () => {
    render(<FormError message="Error" />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('bg-red-100', 'border-red-400', 'text-red-700');
  });

  it('renders with long error message', () => {
    const longMessage = 'This is a very long error message that should still display correctly';
    render(<FormError message={longMessage} />);
    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });
});
