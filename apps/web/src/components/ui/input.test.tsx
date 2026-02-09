import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './input';

describe('Input Component', () => {
  describe('Rendering', () => {
    it('renders input field', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('renders with label', () => {
      render(<Input label="Email" />);
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    it('renders with required indicator', () => {
      render(<Input label="Email" required />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('renders with error message', () => {
      render(<Input error="This field is required" />);
      expect(screen.getByRole('alert')).toHaveTextContent('This field is required');
    });

    it('applies error styling when error is present', () => {
      render(<Input error="Error" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-red-500');
    });
  });

  describe('Accessibility', () => {
    it('generates unique ID for input', () => {
      const { container } = render(<Input label="Test" />);
      const input = container.querySelector('input');
      const label = container.querySelector('label');
      expect(input?.id).toBeTruthy();
      expect(label?.htmlFor).toBe(input?.id);
    });

    it('uses provided ID', () => {
      render(<Input id="custom-id" label="Test" />);
      expect(screen.getByLabelText('Test')).toHaveAttribute('id', 'custom-id');
    });

    it('sets aria-invalid to false when no error', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'false');
    });

    it('sets aria-invalid to true when error exists', () => {
      render(<Input error="Error" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('links error message with aria-describedby', () => {
      render(<Input error="Error message" label="Test" />);
      const input = screen.getByLabelText('Test');
      const errorId = input.getAttribute('aria-describedby');
      expect(errorId).toBeTruthy();
      expect(screen.getByText('Error message')).toHaveAttribute('id', errorId);
    });
  });

  describe('User Interaction', () => {
    it('handles text input', async () => {
      const user = userEvent.setup();
      render(<Input />);
      const input = screen.getByRole('textbox');
      
      await user.type(input, 'Hello World');
      expect(input).toHaveValue('Hello World');
    });

    it('calls onChange handler', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<Input onChange={handleChange} />);
      
      await user.type(screen.getByRole('textbox'), 'a');
      expect(handleChange).toHaveBeenCalled();
    });

    it('supports different input types', () => {
      const { rerender } = render(<Input type="email" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
      
      rerender(<Input type="password" />);
      expect(screen.getByDisplayValue('')).toHaveAttribute('type', 'password');
    });

    it('can be disabled', () => {
      render(<Input disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });
  });

  describe('Props', () => {
    it('accepts custom className', () => {
      render(<Input className="custom-class" />);
      expect(screen.getByRole('textbox')).toHaveClass('custom-class');
    });

    it('accepts placeholder', () => {
      render(<Input placeholder="Enter text" />);
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('accepts autoComplete', () => {
      render(<Input autoComplete="email" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('autocomplete', 'email');
    });
  });
});
