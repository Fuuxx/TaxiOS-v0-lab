import type { Preview } from "@storybook/react-vite";

import "../src/styles/globals.css";

const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: "padded",
    a11y: {
      test: "todo",
    },
  },
} satisfies Preview;

export default preview;
