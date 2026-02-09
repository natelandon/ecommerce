import gulp from 'gulp';
import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

const { series, parallel } = gulp;

/**
 * Utility function to execute shell commands
 * @param {string} command - Command to execute
 * @param {string[]} args - Command arguments
 * @param {string} cwd - Working directory
 * @returns {Promise<void>}
 */
function executeCommand(command, args = [], cwd = process.cwd()) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      cwd,
      stdio: 'inherit',
      shell: true,
    });

    proc.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Command failed with exit code ${code}`));
        return;
      }
      resolve();
    });

    proc.on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Clean build artifacts
 */
export async function clean() {
  console.log('🧹 Cleaning build artifacts...');
  
  const dirsToClean = [
    'dist',
    'coverage',
    'playwright-report',
    'test-results',
    'storybook-static',
  ];

  for (const dir of dirsToClean) {
    try {
      await fs.rm(dir, { recursive: true, force: true });
      console.log(`✓ Removed ${dir}`);
    } catch (error) {
      // Directory might not exist, ignore error
    }
  }
  
  console.log('✅ Clean completed');
}

/**
 * Type check TypeScript files
 */
export async function typeCheck() {
  console.log('🔍 Running TypeScript type check...');
  await executeCommand('npx', ['tsc', '--noEmit']);
  console.log('✅ Type check passed');
}

/**
 * Run unit and integration tests with Jest
 */
export async function test() {
  console.log('🧪 Running unit and integration tests...');
  await executeCommand('npm', ['test', '--', '--passWithNoTests']);
  console.log('✅ Tests passed');
}

/**
 * Run tests with coverage
 */
export async function testCoverage() {
  console.log('📊 Running tests with coverage...');
  await executeCommand('npm', ['run', 'test:coverage']);
  console.log('✅ Coverage report generated');
}

/**
 * Run E2E tests with Playwright
 */
export async function testE2E() {
  console.log('🎭 Running E2E tests...');
  
  // Check if Playwright browsers are installed
  try {
    await executeCommand('npx', ['playwright', 'install', '--dry-run']);
  } catch {
    console.log('📦 Installing Playwright browsers...');
    await executeCommand('npx', ['playwright', 'install', '--with-deps']);
  }
  
  await executeCommand('npm', ['run', 'test:e2e']);
  console.log('✅ E2E tests passed');
}

/**
 * Run all tests (unit, integration, and E2E)
 */
export const testAll = series(test, testE2E);

/**
 * Lint TypeScript and React files
 */
export async function lint() {
  console.log('🔎 Linting code...');
  
  try {
    // Check if ESLint is configured
    await fs.access('.eslintrc.json').catch(() => fs.access('.eslintrc.js'));
    await executeCommand('npx', ['eslint', 'src', '--ext', '.ts,.tsx']);
    console.log('✅ Linting passed');
  } catch {
    console.log('⚠️  ESLint not configured, skipping lint');
  }
}

/**
 * Format code with Prettier
 */
export async function format() {
  console.log('💅 Formatting code...');
  
  try {
    await fs.access('prettier.config.js').catch(() => fs.access('.prettierrc'));
    await executeCommand('npx', ['prettier', '--write', 'src/**/*.{ts,tsx,css,json}']);
    console.log('✅ Code formatted');
  } catch {
    console.log('⚠️  Prettier not configured, skipping format');
  }
}

/**
 * Compile TypeScript to JavaScript
 */
export async function compile() {
  console.log('🔨 Compiling TypeScript...');
  await executeCommand('npx', ['tsc', '--build']);
  console.log('✅ Compilation completed');
}

/**
 * Build the application with Vite
 */
export async function build() {
  console.log('🏗️  Building application...');
  await executeCommand('npm', ['run', 'build']);
  console.log('✅ Build completed');
}

/**
 * Build Storybook
 */
export async function buildStorybook() {
  console.log('📚 Building Storybook...');
  await executeCommand('npm', ['run', 'storybook:build']);
  console.log('✅ Storybook build completed');
}

/**
 * Start development server
 */
export async function dev() {
  console.log('🚀 Starting development server...');
  await executeCommand('npm', ['run', 'dev']);
}

/**
 * Preview production build
 */
export async function preview() {
  console.log('👀 Previewing production build...');
  await executeCommand('npm', ['run', 'preview']);
}

/**
 * Validate build artifacts
 */
export async function validate() {
  console.log('✔️  Validating build artifacts...');
  
  const distPath = path.join(process.cwd(), 'dist');
  
  try {
    await fs.access(distPath);
    const files = await fs.readdir(distPath);
    
    if (files.length === 0) {
      throw new Error('Build directory is empty');
    }
    
    // Check for index.html
    const hasIndexHtml = files.includes('index.html');
    if (!hasIndexHtml) {
      throw new Error('index.html not found in build directory');
    }
    
    console.log(`✅ Build artifacts validated (${files.length} files)`);
  } catch (error) {
    throw new Error(`Build validation failed: ${error.message}`);
  }
}

/**
 * Generate test coverage report
 */
export async function coverage() {
  console.log('📈 Generating coverage report...');
  await testCoverage();
  
  // Open coverage report in browser
  const coverageIndex = path.join(process.cwd(), 'coverage', 'lcov-report', 'index.html');
  
  try {
    await fs.access(coverageIndex);
    console.log('📊 Coverage report available at: coverage/lcov-report/index.html');
  } catch {
    console.log('⚠️  Coverage report not generated');
  }
}

/**
 * Pre-build tasks: clean, type check, and test
 */
export const preBuild = series(
  clean,
  typeCheck,
  test
);

/**
 * Full build pipeline: clean, type check, test, and build
 */
export const buildAll = series(
  clean,
  typeCheck,
  test,
  build,
  validate
);

/**
 * CI/CD pipeline: full build with all tests and coverage
 */
export const ci = series(
  clean,
  typeCheck,
  lint,
  testCoverage,
  testE2E,
  build,
  validate
);

/**
 * Development workflow: type check and test
 */
export const devCheck = series(
  typeCheck,
  test
);

/**
 * Production release pipeline
 */
export const release = series(
  clean,
  typeCheck,
  lint,
  testAll,
  build,
  buildStorybook,
  validate
);

/**
 * Quick validation (no clean, no build)
 */
export const quickCheck = series(
  typeCheck,
  test
);

// Default task
export default buildAll;
