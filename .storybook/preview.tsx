import type { Preview } from '@storybook/react-vite';
import '../src/styles/tokens.css';
import '../src/styles/jfi.css';

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Color theme',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
    locale: {
      description: 'Language of the story copy',
      toolbar: {
        title: 'Locale',
        icon: 'globe',
        items: [
          { value: 'en', title: 'English' },
          { value: 'es', title: 'Español' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light', locale: 'en' },
  decorators: [
    // Applies the DS theme and language to every story. Stories read `globals.locale`
    // to pick their copy; once the I18nProvider exists, it gets wired in here.
    (Story, { globals }) => (
      <div
        className="jfi-root"
        data-theme={globals.theme}
        lang={globals.locale}
        style={{ background: 'var(--bg)', padding: 'var(--space-6)', minHeight: '100vh' }}
      >
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    controls: { matchers: { color: /(background|color)$/i } },
    // axe runs on every story; violations fail the story instead of being a warning.
    a11y: { test: 'error' },
  },
};

export default preview;
