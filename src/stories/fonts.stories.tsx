import type { Meta, StoryObj } from "@storybook/react";

import Fonts from "./fonts";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Example/Fonts",
  component: Fonts,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  tags: [],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
} satisfies Meta<typeof Fonts>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Typos: Story = {
  args: {},
};
