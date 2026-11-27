import { realpathSync } from 'node:fs';
import type { StorybookConfig } from '@storybook/react-vite';

// Windows: when the shell's cwd has a lowercase drive letter ("c:\..." in the VS Code terminal),
// Storybook keys stories by absolute path instead of relative, and no story loads. Use the real casing.
if (process.platform === 'win32') process.chdir(realpathSync.native(process.cwd()));

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: { name: '@storybook/react-vite', options: {} },
  core: { disableTelemetry: true },
};

export default config;
