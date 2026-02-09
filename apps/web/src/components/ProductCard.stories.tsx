import type { Meta, StoryObj } from "@storybook/react";
import ProductCard from "./ProductCard";

const meta: Meta<typeof ProductCard> = {
  title: "Components/ProductCard",
  component: ProductCard,
  args: {
    id: 1,
    title: "Classic Tee",
    price: 29.99,
    image: "https://via.placeholder.com/160x160.png?text=Product",
    category: "Apparel",
    description: "Soft cotton tee with a relaxed fit."
  }
};

export default meta;

type Story = StoryObj<typeof ProductCard>;

export const Default: Story = {};
