import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import ProductCard from './ProductCard';

const mockProduct = {
  id: 1,
  title: 'Test Product',
  price: 99.99,
  image: 'https://example.com/image.jpg',
  category: "men's clothing",
  description: 'Test description',
};

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('ProductCard Component', () => {
  const mockOnClick = jest.fn();
  const mockOnAddToCart = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders product information', () => {
      renderWithRouter(
        <ProductCard
          {...mockProduct}
          onClick={mockOnClick}
          onAddToCart={mockOnAddToCart}
        />
      );

      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('$99.99')).toBeInTheDocument();
      expect(screen.getByText("men's clothing")).toBeInTheDocument();
    });

    it('renders product image', () => {
      renderWithRouter(
        <ProductCard
          {...mockProduct}
          onClick={mockOnClick}
          onAddToCart={mockOnAddToCart}
        />
      );

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', mockProduct.image);
      expect(image).toHaveAttribute('alt', mockProduct.title);
    });

    it('renders add to cart button', () => {
      renderWithRouter(
        <ProductCard
          {...mockProduct}
          onClick={mockOnClick}
          onAddToCart={mockOnAddToCart}
        />
      );

      expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
    });
  });

  describe('User Interaction', () => {
    it('calls onClick when card is clicked', async () => {
      const user = userEvent.setup();
      renderWithRouter(
        <ProductCard
          {...mockProduct}
          onClick={mockOnClick}
          onAddToCart={mockOnAddToCart}
        />
      );

      await user.click(screen.getByText('Test Product'));
      expect(mockOnClick).toHaveBeenCalledWith(mockProduct.id);
    });

    it('calls onAddToCart when add to cart button is clicked', async () => {
      const user = userEvent.setup();
      renderWithRouter(
        <ProductCard
          {...mockProduct}
          onClick={mockOnClick}
          onAddToCart={mockOnAddToCart}
        />
      );

      await user.click(screen.getByRole('button', { name: /add to cart/i }));
      expect(mockOnAddToCart).toHaveBeenCalledWith(mockProduct.id);
      expect(mockOnClick).not.toHaveBeenCalled();
    });

    it('prevents onClick when add to cart is clicked', async () => {
      const user = userEvent.setup();
      renderWithRouter(
        <ProductCard
          {...mockProduct}
          onClick={mockOnClick}
          onAddToCart={mockOnAddToCart}
        />
      );

      const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
      await user.click(addToCartButton);
      
      expect(mockOnAddToCart).toHaveBeenCalledTimes(1);
      expect(mockOnClick).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has accessible image alt text', () => {
      renderWithRouter(
        <ProductCard
          {...mockProduct}
          onClick={mockOnClick}
          onAddToCart={mockOnAddToCart}
        />
      );

      expect(screen.getByAltText('Test Product')).toBeInTheDocument();
    });

    it('button has accessible name', () => {
      renderWithRouter(
        <ProductCard
          {...mockProduct}
          onClick={mockOnClick}
          onAddToCart={mockOnAddToCart}
        />
      );

      expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles long product titles', () => {
      renderWithRouter(
        <ProductCard
          {...mockProduct}
          title="This is a very long product title that should be displayed correctly"
          onClick={mockOnClick}
          onAddToCart={mockOnAddToCart}
        />
      );

      expect(screen.getByText(/This is a very long product title/)).toBeInTheDocument();
    });

    it('handles zero price', () => {
      renderWithRouter(
        <ProductCard
          {...mockProduct}
          price={0}
          onClick={mockOnClick}
          onAddToCart={mockOnAddToCart}
        />
      );

      expect(screen.getByText('$0.00')).toBeInTheDocument();
    });

    it('handles high price', () => {
      renderWithRouter(
        <ProductCard
          {...mockProduct}
          price={999999.99}
          onClick={mockOnClick}
          onAddToCart={mockOnAddToCart}
        />
      );

      expect(screen.getByText('$999,999.99')).toBeInTheDocument();
    });
  });
});
