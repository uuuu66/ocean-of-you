import type { Meta, StoryObj } from "@storybook/react";

import IconInput from "./IconInput";
import { iconPaths } from "../../../../public/icons";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Example/Input",
  component: IconInput,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  args: {},
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
} satisfies Meta<typeof IconInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const iconInput: Story = {
  args: {
    children: "Input",
    placeholder: "placeholder",
    Icon: iconPaths.Loading,
  },
};
