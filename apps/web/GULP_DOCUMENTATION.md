# Gulp Build Pipeline Documentation

## Overview

This Gulp configuration provides a comprehensive build pipeline for the E-Commerce web application. It automates testing, compilation, building, and validation tasks while ensuring code quality and TypeScript best practices.

## Prerequisites

```bash
# Install Gulp CLI globally (optional, but recommended)
npm install -g gulp-cli

# Install project dependencies
npm install
```

## Available Tasks

### Core Tasks

#### `gulp clean`
Removes all build artifacts and generated files.

**Cleaned directories:**
- `dist/` - Production build output
- `coverage/` - Test coverage reports
- `playwright-report/` - E2E test reports
- `test-results/` - Test result files
- `storybook-static/` - Storybook build output

**Usage:**
```bash
gulp clean
```

**When to use:**
- Before a fresh build
- When experiencing build issues
- Before running CI/CD pipelines

---

#### `gulp typeCheck`
Runs TypeScript compiler in type-checking mode (no output).

**What it checks:**
- Type errors
- Interface/type compatibility
- Generic constraints
- Module resolution
- TypeScript configuration

**Usage:**
```bash
gulp typeCheck
```

**Best practices enforced:**
- No `any` types (unless absolutely necessary)
- Proper type annotations
- Strict null checks
- No implicit any

**Example output:**
```
🔍 Running TypeScript type check...
✅ Type check passed
```

---

#### `gulp test`
Runs unit and integration tests using Jest.

**Test coverage:**
- Component tests
- Store tests
- Page tests
- Integration tests
- Utility function tests

**Usage:**
```bash
gulp test
```

**Features:**
- Parallel test execution
- Fast feedback
- Detailed error reporting
- Passes even with no tests (useful for new projects)

---

#### `gulp testCoverage`
Runs tests with coverage reporting.

**Coverage metrics:**
- Statements: 70% threshold
- Branches: 70% threshold
- Functions: 70% threshold
- Lines: 70% threshold

**Usage:**
```bash
gulp testCoverage
```

**Output:**
- Console coverage summary
- HTML report in `coverage/lcov-report/index.html`
- LCOV file for CI tools

**View coverage report:**
```bash
# After running testCoverage
open coverage/lcov-report/index.html
```

---

#### `gulp testE2E`
Runs end-to-end tests using Playwright.

**Test scenarios:**
- User authentication flows
- Shopping cart operations
- Checkout process
- Product browsing
- Full user journeys

**Usage:**
```bash
gulp testE2E
```

**Features:**
- Auto-installs Playwright browsers if needed
- Tests across multiple browsers (Chromium, Firefox, WebKit)
- Mobile viewport testing
- Automatic screenshots on failure
- Trace recording on retry

**Browser matrix:**
- Desktop Chrome
- Desktop Firefox
- Desktop Safari
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)

---

#### `gulp testAll`
Runs all tests sequentially (unit, integration, and E2E).

**Usage:**
```bash
gulp testAll
```

**Execution order:**
1. Unit and integration tests
2. E2E tests

**When to use:**
- Before committing major changes
- Before creating pull requests
- Pre-deployment validation

---

#### `gulp lint`
Lints TypeScript and React files using ESLint.

**Checks:**
- Code style violations
- Best practice violations
- Potential bugs
- Accessibility issues
- React hooks rules

**Usage:**
```bash
gulp lint
```

**Note:** Skips gracefully if ESLint is not configured.

---

#### `gulp format`
Formats code using Prettier.

**Formatted files:**
- TypeScript files (`.ts`, `.tsx`)
- CSS files
- JSON files

**Usage:**
```bash
gulp format
```

**Note:** Skips gracefully if Prettier is not configured.

---

#### `gulp compile`
Compiles TypeScript to JavaScript using `tsc --build`.

**Usage:**
```bash
gulp compile
```

**Output:**
- Compiled JavaScript files
- Type declaration files (`.d.ts`)
- Source maps

---

#### `gulp build`
Builds the production-ready application using Vite.

**Build optimizations:**
- Code minification
- Tree shaking
- Asset optimization
- Code splitting
- CSS bundling

**Usage:**
```bash
gulp build
```

**Output:**
- `dist/` directory with optimized assets
- `dist/index.html` entry point
- Chunked JavaScript bundles
- Optimized images and assets

---

#### `gulp buildStorybook`
Builds Storybook documentation.

**Usage:**
```bash
gulp buildStorybook
```

**Output:**
- `storybook-static/` directory
- Deployable static site

---

#### `gulp validate`
Validates build artifacts.

**Checks:**
- `dist/` directory exists
- `dist/index.html` exists
- Build is not empty

**Usage:**
```bash
gulp validate
```

**Example output:**
```
✔️  Validating build artifacts...
✅ Build artifacts validated (23 files)
```

---

#### `gulp dev`
Starts the Vite development server.

**Features:**
- Hot Module Replacement (HMR)
- Fast refresh
- Instant updates
- Error overlay

**Usage:**
```bash
gulp dev
```

**Access:**
- Local: http://localhost:5173
- Network: http://192.168.x.x:5173

---

#### `gulp preview`
Previews the production build locally.

**Usage:**
```bash
# Build first, then preview
gulp build
gulp preview
```

**Access:**
- http://localhost:4173

---

### Composite Tasks

#### `gulp preBuild`
Runs pre-build checks before building.

**Includes:**
1. Clean build artifacts
2. Type check TypeScript
3. Run tests

**Usage:**
```bash
gulp preBuild
```

**When to use:**
- Before building for production
- As a pre-commit hook

---

#### `gulp buildAll` (Default)
Complete build pipeline with validation.

**Includes:**
1. Clean
2. Type check
3. Test
4. Build
5. Validate

**Usage:**
```bash
gulp buildAll
# or simply
gulp
```

**When to use:**
- Production builds
- Pre-deployment
- Release preparation

---

#### `gulp ci`
Full CI/CD pipeline with all checks.

**Includes:**
1. Clean
2. Type check
3. Lint
4. Test with coverage
5. E2E tests
6. Build
7. Validate

**Usage:**
```bash
gulp ci
```

**When to use:**
- Continuous Integration environments
- GitHub Actions / GitLab CI
- Pre-merge validation

---

#### `gulp devCheck`
Quick development validation.

**Includes:**
1. Type check
2. Unit tests

**Usage:**
```bash
gulp devCheck
```

**When to use:**
- During active development
- Before committing small changes
- Quick validation loop

---

#### `gulp release`
Production release pipeline.

**Includes:**
1. Clean
2. Type check
3. Lint
4. All tests (unit + E2E)
5. Build application
6. Build Storybook
7. Validate

**Usage:**
```bash
gulp release
```

**When to use:**
- Creating production releases
- Deploying to production
- Publishing packages

---

#### `gulp quickCheck`
Fast validation without build.

**Includes:**
1. Type check
2. Tests

**Usage:**
```bash
gulp quickCheck
```

**When to use:**
- Rapid iteration during development
- Pre-commit validation
- When build artifacts already exist

---

#### `gulp coverage`
Generate and display test coverage report.

**Includes:**
1. Run tests with coverage
2. Show coverage summary
3. Display report location

**Usage:**
```bash
gulp coverage
```

**Output:**
```
📈 Generating coverage report...
📊 Coverage report available at: coverage/lcov-report/index.html
```

---

## Workflow Examples

### Daily Development Workflow

```bash
# Start development server
gulp dev

# In another terminal, run quick checks
gulp devCheck

# Before committing
gulp quickCheck
```

### Pre-Commit Workflow

```bash
# Run type check and tests
gulp devCheck

# Format code (optional)
gulp format

# Run linter (if configured)
gulp lint
```

### Pre-Merge/PR Workflow

```bash
# Full test suite
gulp testAll

# Or full CI pipeline
gulp ci
```

### Production Build Workflow

```bash
# Complete build pipeline
gulp buildAll

# Or full release pipeline
gulp release
```

### Debugging Test Failures

```bash
# Run tests with coverage to see what's missing
gulp testCoverage

# Open coverage report
open coverage/lcov-report/index.html

# Run specific E2E test in headed mode
npm run test:e2e:headed
```

## Integration with npm Scripts

You can add Gulp tasks to your `package.json` scripts:

```json
{
  "scripts": {
    "gulp": "gulp",
    "prebuild": "gulp preBuild",
    "postbuild": "gulp validate",
    "ci": "gulp ci",
    "dev:check": "gulp devCheck",
    "release": "gulp release"
  }
}
```

## CI/CD Integration

### GitHub Actions

```yaml
name: CI

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run CI pipeline
        run: npx gulp ci
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          directory: ./coverage
```

### GitLab CI

```yaml
stages:
  - test
  - build

test:
  stage: test
  image: node:18
  script:
    - npm ci
    - npx gulp ci
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml
```

## TypeScript Best Practices Enforced

### 1. No `any` Type (Unless Necessary)

❌ **Bad:**
```typescript
function processData(data: any) {
  return data.value;
}
```

✅ **Good:**
```typescript
interface DataType {
  value: string;
}

function processData(data: DataType): string {
  return data.value;
}
```

### 2. Proper Type Annotations

❌ **Bad:**
```typescript
const user = { name: 'John', age: 30 };
```

✅ **Good:**
```typescript
interface User {
  name: string;
  age: number;
}

const user: User = { name: 'John', age: 30 };
```

### 3. Type Guards

❌ **Bad:**
```typescript
function isString(value: unknown) {
  return typeof value === 'string';
}
```

✅ **Good:**
```typescript
function isString(value: unknown): value is string {
  return typeof value === 'string';
}
```

### 4. Generic Constraints

❌ **Bad:**
```typescript
function getProperty<T>(obj: T, key: string) {
  return obj[key]; // Error
}
```

✅ **Good:**
```typescript
function getProperty<T extends object, K extends keyof T>(
  obj: T,
  key: K
): T[K] {
  return obj[key];
}
```

### 5. Strict Null Checks

❌ **Bad:**
```typescript
function getName(user: User): string {
  return user.name; // What if user is null?
}
```

✅ **Good:**
```typescript
function getName(user: User | null): string {
  return user?.name ?? 'Unknown';
}
```

## Error Handling

### Build Failures

If a task fails, Gulp will:
1. Display an error message
2. Return a non-zero exit code
3. Stop the pipeline (for series tasks)

**Example:**
```
Error: Command failed with exit code 1
    at executeCommand (gulpfile.js:24:16)
```

### Recovery Steps

```bash
# Clean and retry
gulp clean
gulp build

# Check specific task
gulp typeCheck  # Identify type errors
gulp test       # Identify test failures
gulp lint       # Identify code issues
```

## Performance Optimization

### Parallel vs Series

- **Parallel tasks** run simultaneously (faster)
- **Series tasks** run sequentially (safer, dependencies)

**Example:**
```javascript
// These can run in parallel
export const parallelTasks = parallel(lint, format);

// These must run in series
export const seriesTasks = series(clean, build, validate);
```

### Task Caching

Some tasks benefit from caching:
- TypeScript compilation
- Jest test runs
- Build artifacts

Gulp doesn't invalidate these caches, so:
```bash
# Force clean build
gulp clean && gulp build
```

## Troubleshooting

### Common Issues

#### 1. "Gulp command not found"

```bash
# Install globally
npm install -g gulp-cli

# Or use npx
npx gulp
```

#### 2. "Cannot find module 'gulp'"

```bash
# Install dependencies
npm install
```

#### 3. Type check fails

```bash
# Check TypeScript files
npx tsc --noEmit

# View specific errors
gulp typeCheck
```

#### 4. Tests fail

```bash
# Run tests with verbose output
npm test -- --verbose

# Run specific test file
npm test -- useCartStore.test.ts
```

#### 5. E2E tests fail

```bash
# Install Playwright browsers
npx playwright install --with-deps

# Run in headed mode to see what's happening
npm run test:e2e:headed

# Run with UI mode
npm run test:e2e:ui
```

## Best Practices

### 1. Always Run Type Check First

```bash
gulp typeCheck && gulp build
```

### 2. Run Tests Before Building

```bash
gulp preBuild  # Includes clean, typeCheck, test
```

### 3. Use CI Pipeline for Merge Requests

```bash
gulp ci  # Full pipeline with all checks
```

### 4. Clean Before Release

```bash
gulp clean && gulp release
```

### 5. Validate After Building

```bash
gulp build && gulp validate
```

## Monitoring and Logging

Each task provides clear console output:

- 🧹 Clean tasks
- 🔍 Type checking
- 🧪 Testing
- 🔨 Compilation
- 🏗️ Building
- ✅ Success indicators
- ⚠️ Warnings
- ❌ Errors

**Example output:**
```
🧹 Cleaning build artifacts...
✓ Removed dist
✓ Removed coverage
✅ Clean completed

🔍 Running TypeScript type check...
✅ Type check passed

🧪 Running unit and integration tests...
✅ Tests passed (42 tests)

🏗️ Building application...
✅ Build completed

✔️ Validating build artifacts...
✅ Build artifacts validated (23 files)
```

## Extending Gulp Configuration

### Adding Custom Tasks

```javascript
// In gulpfile.js
export async function customTask() {
  console.log('🎯 Running custom task...');
  // Your logic here
  console.log('✅ Custom task completed');
}

// Create composite task
export const myWorkflow = series(clean, customTask, build);
```

### Adding Task Dependencies

```javascript
export const deployPipeline = series(
  release,        // Build everything
  customValidate, // Custom validation
  deploy          // Deploy to server
);
```

## Summary

This Gulp configuration provides:

✅ **Comprehensive testing** - Unit, integration, and E2E tests
✅ **TypeScript safety** - Strict type checking and best practices
✅ **Code quality** - Linting and formatting
✅ **Build optimization** - Vite production builds
✅ **Validation** - Artifact verification
✅ **CI/CD ready** - Complete pipeline for automation
✅ **Developer friendly** - Clear output and error messages
✅ **Flexible workflows** - Tasks for every scenario

Use `gulp --tasks` to see all available tasks at any time.
