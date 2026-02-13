# Ecommerce Platform

A modern, full-stack e-commerce application built with React, TypeScript, and Node.js. This monorepo contains a performant frontend, scalable API backend, and shared utilities.

## Overview

This application provides a complete e-commerce experience including product browsing, filtering, user authentication, shopping cart management, checkout with Stripe payment processing, and order management. The architecture is optimized for performance, reliability, and developer experience.

### Features

- **Product Catalog**: Browse and filter products with advanced filtering capabilities
- **User Authentication**: Secure signup and login with profile management
- **Shopping Cart**: Full cart management with real-time updates
- **Checkout System**: Streamlined checkout process with Stripe payment integration
- **Order Management**: Track orders and view order history
- **Responsive Design**: Mobile-first UI with dark mode support
- **Feature Flags**: GrowthBook integration for A/B testing and feature management
- **Performance Optimized**: Lighthouse-optimized with caching strategies

## Tech Stack

### Frontend (`apps/web`)

| Category | Technologies |
|----------|---------------|
| **Framework** | React 18.3 with TypeScript |
| **Build Tool** | Vite 5 |
| **Styling** | Tailwind CSS with PostCSS |
| **Components** | Shadcn UI, Radix UI, Lucide React |
| **State Management** | Zustand 4.5 |
| **Routing** | React Router v6 |
| **Forms & Validation** | Yup |
| **Payments** | Stripe React (stripe-js, react-stripe-js) |
| **Feature Flags** | GrowthBook React |
| **UI Utilities** | class-variance-authority, clsx, tailwind-merge |
| **Theme** | next-themes for dark mode |
| **Testing** | Jest, Playwright, Testing Library, Storybook |

### Backend (`apps/api`)

| Category | Technologies |
|----------|---------------|
| **Runtime** | Node.js with TypeScript |
| **Framework** | Express 4.19 |
| **Database/Caching** | Redis 4.7 |
| **API Validation** | Yup schema validation |
| **CORS** | CORS middleware |
| **Development** | ts-node-dev for hot reload |
| **Testing** | Jest with Supertest for integration tests |

### Development Tools

| Tool | Purpose |
|------|---------|
| **Monorepo** | npm workspaces |
| **Build Automation** | Gulp 4 |
| **Code Quality** | ESLint, Prettier |
| **Concurrency** | Concurrently for parallel tasks |
| **Type Checking** | TypeScript 5.5 |
| **Containerization** | Docker + Docker Compose |
| **Testing Framework** | Jest, Playwright, Storybook Test Runner |

### Infrastructure

- **Redis** (Alpine): Distributed caching and session management
- **Docker Compose**: Local development environment with health checks
- **Nginx-ready**: Configured for containerized deployment

## Getting Started

### Prerequisites

- Node.js 18+ and npm 9+
- Docker and Docker Compose (optional, for Redis)

### Installation

```bash
npm install
```

### Development

Start both the frontend and API server in development mode:

```bash
npm run dev
```

This runs:
- Frontend: http://localhost:5173 (Vite dev server)
- API: http://localhost:4000

### Monorepo Workspace Commands

Install dependencies for a specific workspace:
```bash
npm install -w apps/api
npm install -w apps/web
```

Run commands in workspace:
```bash
npm run <command> -w apps/api
npm run <command> -w apps/web
npm run <command> -ws  # all workspaces
```

## Scripts

### Development & Building

| Script | Description |
|--------|-------------|
| `npm run dev` | Start frontend (Vite) + API (ts-node-dev) concurrently |
| `npm run build` | Build all workspaces for production |
| `npm run clean` | Remove all build artifacts |
| `npm run lint` | Lint all workspaces |
| `npm run format` | Format code with Prettier |

### Frontend (`apps/web`)

| Script | Description |
|--------|-------------|
| `npm run dev -w apps/web` | Start Vite dev server |
| `npm run build -w apps/web` | Build production bundle |
| `npm run preview -w apps/web` | Preview production build locally |
| `npm run test -w apps/web` | Run unit tests with Jest |
| `npm run test:e2e -w apps/web` | Run Playwright e2e tests |
| `npm run test:e2e:ui -w apps/web` | Run e2e tests with UI |
| `npm run storybook -w apps/web` | Start Storybook dev server |
| `npm run storybook:build -w apps/web` | Build Storybook static site |
| `npm run test:coverage -w apps/web` | Generate coverage report |

### API (`apps/api`)

| Script | Description |
|--------|-------------|
| `npm run dev -w apps/api` | Start API dev server with hot reload |
| `npm run build -w apps/api` | Build TypeScript to JavaScript |
| `npm run start -w apps/api` | Run built API server |
| `npm run test -w apps/api` | Run unit tests |
| `npm run test:integration -w apps/api` | Run integration tests against Redis |

## Project Structure

```
ecommerce/
├── apps/
│   ├── api/                    # Express backend API
│   │   ├── src/
│   │   │   ├── services/      # Redis, product services
│   │   │   ├── lib/           # Logger utilities
│   │   │   ├── types/         # API type definitions
│   │   │   └── index.ts       # Express server entry
│   │   ├── Dockerfile         # Container image
│   │   └── jest.*.config.cjs  # Unit & integration test configs
│   │
│   └── web/                    # React + Vite frontend
│       ├── src/
│       │   ├── components/    # Reusable React components
│       │   ├── pages/         # Page components (routes)
│       │   ├── services/      # API service layer
│       │   ├── store/         # Zustand state management
│       │   ├── hooks/         # Custom React hooks
│       │   ├── lib/           # Utilities, constants, validation
│       │   ├── styles/        # Global CSS
│       │   └── main.tsx       # React entry point
│       ├── e2e/               # Playwright e2e tests
│       ├── vite.config.ts     # Vite bundler config
│       └── tailwind.config.ts # Tailwind CSS config
│
├── packages/
│   └── shared/                 # Shared types and utilities
│
└── docker-compose.yml          # Local Redis setup
```

## Running with Docker

### Using Docker Compose for Redis

Start Redis locally:
```bash
docker-compose up
```

This starts Redis on port 6379 with persistent storage.

## Testing

### Unit Tests

```bash
npm run test                    # All workspaces
npm run test -w apps/web       # Frontend only
npm run test -w apps/api       # Backend only
```

### Integration Tests

```bash
npm run test:integration       # API integration tests with Redis
```

### End-to-End Tests

```bash
npm run test:e2e               # Run all Playwright tests
npm run test:e2e:ui            # Interactive test UI
npm run test:e2e:headed        # Run tests in browser window
```

### Coverage Reports

```bash
npm run test:coverage -w apps/web
```

## Storybook

View and test components in isolation:

```bash
npm run storybook              # Start Storybook dev server
npm run storybook:test         # Run Storybook test runner
npm run storybook:build        # Build static Storybook site
```

Visit http://localhost:6006 to browse components.

## Environment Configuration

### Frontend

Configuration in `apps/web/src/lib/config.ts`:
- API URL
- Feature flags
- Theme settings

### API

Environment variables:
- `PORT` - Server port (default: 4000)
- `REDIS_HOST` - Redis host (default: localhost)
- `REDIS_PORT` - Redis port (default: 6379)
- `CACHE_TTL` - Cache time-to-live in seconds (default: 3600)

## API Endpoints

### Products
- `GET /api/products` - List all products with caching
- `GET /api/products/:id` - Get product details

### Cart (Client-side only)
- Managed via Zustand store

### Authentication
- User signup and login endpoints
- JWT token-based authentication

### Checkout
- Stripe Payment Intent integration
- Order creation and management

## Performance Optimizations

- **Vite**: Lightning-fast builds and HMR
- **Redis Caching**: Product data and session caching
- **Code Splitting**: React lazy loading and route-based chunks
- **Image Optimization**: Optimized assets in production
- **Tailwind CSS**: Purged unused styles
- **Lighthouse**: Optimized for performance metrics (see lighthouse-production-final.html)

## Code Quality

- **TypeScript**: Full type safety across codebase
- **ESLint**: Code style and best practices
- **Prettier**: Automatic code formatting
- **Jest**: 100% unit test compatibility
- **Playwright**: Reliable e2e testing

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Contributing

1. All code is TypeScript
2. Run `npm run lint` and `npm run format` before committing
3. Write tests for new features
4. Use Storybook for UI component development
5. Follow existing code patterns and conventions

## Documentation

- [Cart & Checkout Implementation](./CART_CHECKOUT.md)
- [Performance Optimization Details](./PERFORMANCE_OPTIMIZATION_IMPLEMENTATION.md)
- [Gulp Build Tasks](./apps/web/GULP_DOCUMENTATION.md)
- [API Redis Setup](./apps/api/REDIS.md)
- [Web Testing Guide](./apps/web/TESTING.md)

## License

Private project
