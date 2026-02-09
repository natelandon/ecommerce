import type { TestRunnerConfig } from '@storybook/test-runner';

const config: TestRunnerConfig = {
  async postVisit(page) {
    await page.waitForTimeout(100);
  },
};

export default config;
