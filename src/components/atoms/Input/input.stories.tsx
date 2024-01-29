import type { Meta, StoryObj } from "@storybook/react";

import Input from "./index";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { getComponentTypeColor } from "@/styles/theme";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Example/Input",
  component: Input,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  args: {},
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Example1: Story = {
  args: {
    inputType: "gray",
  },
  decorators: (Story) => (
    <div className="w-[400px] flex justify-end">
      <Story />
    </div>
  ),
};
export const Reset: Story = {
  args: {
    handleClickReset: () => {
      console.log("hi");
    },
  },
  decorators: (Story) => (
    <div className="w-[400px] flex justify-end">
      <Story />
    </div>
  ),
};
export const Pwd: Story = {
  args: {
    isPassword: true,
  },
  decorators: (Story) => (
    <div className="w-[400px] flex justify-end">
      <Story />
    </div>
  ),
};
