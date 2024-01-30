import TextArea from "@/components/atoms/TextArea";
import { Meta, StoryObj } from "@storybook/react";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Example/TextArea",
  component: TextArea,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  decorators: (Story) => (
    <div className="w-[500px]">
      <Story />
    </div>
  ),
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DEFAULT: Story = {
  args: {
    value: "ss",
    textAreaType: "primary",
    maxLength: 30,
    textAreaVariant: "DEFAULT",
  },
};
export const LINE: Story = {
  args: {
    value: "ss",
    textAreaType: "primary",
    maxLength: 30,
    textAreaVariant: "LINE",
  },
};
