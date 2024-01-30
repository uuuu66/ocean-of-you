import type { Preview } from "@storybook/react";
import { Cute_Font } from "next/font/google";
import "../src/app/globals.css";
import React from "react";
const cuteFont = Cute_Font({ weight: "400", subsets: ["latin"] });
const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <div className={cuteFont.className}>
        {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
        <Story />
      </div>
    ),
  ],
};

export default preview;
