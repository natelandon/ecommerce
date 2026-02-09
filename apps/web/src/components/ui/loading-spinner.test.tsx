import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from './loading-spinner';

describe('LoadingSpinner Component', () => {
  it('renders spinner', () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.querySelector('svg');
    expect(spinner).toBeInTheDocument();
  });

  it('has aria-label for accessibility', () => {
    render(<LoadingSpinner />);
    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  });

  it('renders small size', () => {
    const { container } = render(<LoadingSpinner size="sm" />);
    const spinner = container.querySelector('svg');
    expect(spinner).toHaveClass('h-4', 'w-4');
  });

  it('renders medium size by default', () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.querySelector('svg');
    expect(spinner).toHaveClass('h-6', 'w-6');
  });

  it('renders large size', () => {
    const { container } = render(<LoadingSpinner size="lg" />);
    const spinner = container.querySelector('svg');
    expect(spinner).toHaveClass('h-8', 'w-8');
  });

  it('applies custom className', () => {
    const { container } = render(<LoadingSpinner className="text-blue-500" />);
    const spinner = container.querySelector('svg');
    expect(spinner).toHaveClass('text-blue-500');
  });

  it('has spinning animation', () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.querySelector('svg');
    expect(spinner).toHaveClass('animate-spin');
  });
});
