import type { Meta, StoryObj } from "@storybook/react";

import Button from "./index";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Example/Button",
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  args: {
    $isLoading: true,
  },
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    $buttonType: "primary",
    children: "Button",
  },
};

export const Secondary: Story = {
  args: {
    $buttonType: "secondary",
    children: "Button",
  },
};

export const Green: Story = {
  args: {
    $buttonType: "green",
    children: "Button",
  },
};
export const Red: Story = {
  args: {
    $buttonType: "red",
    children: "Button",
  },
};
export const InlineStyledButton: Story = {
  decorators: (Story) => {
    return (
      <div className="w-[500px]">
        <Story />
      </div>
    );
  },
  args: {
    style: { width: "100%" },
    children: "예시",
    $defaultAnimation: "trembling",
  },
};
