import type { Meta, StoryObj } from "@storybook/react";

import Button from "./IconButton";
import { iconPaths } from "../../../../public/icons";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Example/IconButton",
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  args: {
    Icon: iconPaths.Loading,
  },
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    $iconButtonType: "primary",
    children: "Button",
  },
};

export const Secondary: Story = {
  args: {
    $iconButtonType: "secondary",
    children: "Button",
  },
};

export const Green: Story = {
  args: {
    $iconButtonType: "green",
    children: "Button",
  },
};
export const Red: Story = {
  args: {
    $iconButtonType: "red",
    children: "Button",
  },
};
