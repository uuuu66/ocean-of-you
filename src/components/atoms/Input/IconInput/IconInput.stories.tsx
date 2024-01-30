import type { Meta, StoryObj } from "@storybook/react";

import IconInput from "./IconInput";
import { iconPaths } from "../../../../../public/icons";
import { getComponentTypeColor } from "@/styles/theme";
import { CheckIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Example/IconInput",
  component: IconInput,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  args: {},
  decorators: (Story) => (
    <div className="border-gray5 border border-solid w-[400px] relative overflow-auto p-4 rounded-xl">
      <Story />
    </div>
  ),
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
} satisfies Meta<typeof IconInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    children: "Input",
    placeholder: "placeholder",
    Icon: MagnifyingGlassIcon,
    $isIconOpenButton: true,

    $submitButton: {
      Icon: CheckIcon,
      iconProps: {
        fill: getComponentTypeColor("primary", 1),
        stroke: getComponentTypeColor("primary", 2),
      },
    },
  },
};
export const Secondary: Story = {
  args: {
    children: "Input",
    placeholder: "placeholder",
    Icon: MagnifyingGlassIcon,
    $inputType: "secondary",
    $isIconOpenButton: true,
    $iconProps: {
      stroke: getComponentTypeColor("secondary", 2),
      fill: "transparent",
      activeProps: {
        stroke: getComponentTypeColor("secondary", 5),
        fill: "transparent",
      },
    },
    $submitButton: {
      Icon: CheckIcon,
      iconProps: {
        fill: getComponentTypeColor("secondary", 0),
        stroke: getComponentTypeColor("secondary", 2),
      },
    },
  },
};
export const Green: Story = {
  args: {
    children: "Input",
    placeholder: "placeholder",
    Icon: MagnifyingGlassIcon,
    $inputType: "green",
    $isIconOpenButton: true,
    $iconProps: {
      stroke: getComponentTypeColor("green", 2),
      fill: "transparent",
      activeProps: {
        stroke: getComponentTypeColor("green", 5),
        fill: "transparent",
      },
    },
    $submitButton: {
      Icon: CheckIcon,
      iconProps: {
        fill: getComponentTypeColor("green", 0),
        stroke: getComponentTypeColor("green", 2),
      },
    },
  },
};
export const Red: Story = {
  args: {
    children: "Input",
    placeholder: "placeholder",
    $inputType: "red",
    Icon: MagnifyingGlassIcon,
    $isIconOpenButton: true,
    $iconProps: {
      stroke: getComponentTypeColor("red", 2),
      fill: "transparent",
      activeProps: {
        stroke: getComponentTypeColor("red", 5),
        fill: "transparent",
      },
    },
    $submitButton: {
      Icon: CheckIcon,
      iconProps: {
        fill: getComponentTypeColor("red", 0),
        stroke: getComponentTypeColor("red", 2),
      },
    },
  },
};
