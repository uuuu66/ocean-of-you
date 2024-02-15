import type { Meta, StoryObj } from "@storybook/react";
import { common } from "@/components/common";
import { iconPaths } from "../../public/icons";
import { useState } from "react";
import { ButtonProps } from "@/components/common/Button";
import { InputProps } from "@/components/common/Input";

import { IconButtonProps } from "@/components/common/IconButton/IconButton";
import { TextAreaProps } from "@/components/common/TextArea";
import Dropdown from "@/components/headless/Dropdown";
import DropdownTrigger from "@/components/headless/Dropdown/DropdownTrigger";
import DropdownMenu from "@/components/headless/Dropdown/DropdownMenu";

interface Props {
  buttonProps: Partial<ButtonProps>;
  inputProps: Partial<InputProps>;

  iconButtonProps: IconButtonProps;
  textAreaProps: Partial<TextAreaProps>;
}
const Ex: React.FC<Props> = (props) => {
  const [input, setInput] = useState("인풋");
  const [iconInput, setIconInput] = useState("아이콘 인풋");
  const [textArea, setTextArea] = useState("텍스트 에어리어");
  const { buttonProps, iconButtonProps, inputProps, textAreaProps } = props;
  return (
    <div className="w-[700px] flex flex-col gap-5">
      <common.Button {...buttonProps}>버튼</common.Button>{" "}
      <common.Button pressAnimation="fill">버튼</common.Button>{" "}
      <common.Button buttonType="secondary">버튼</common.Button>{" "}
      <common.Button defaultAnimation="trembling">버튼</common.Button>{" "}
      <common.Button isLoading>버튼</common.Button>{" "}
      <div>
        <div className="bg-primary6 w-[36px] h-[36px] flex justify-center items-center">
          <common.IconButton {...iconButtonProps} Icon={iconPaths.NaviArrow} />
        </div>
        <div className="bg-primary3 w-[36px] h-[36px] flex justify-center items-center">
          <common.IconButton
            Icon={iconPaths.NaviArrow}
            iconAnimationType="rotate"
            iconButtonType={"primary"}
            iconProps={{ width: 12, height: 12 }}
          />
        </div>
        <div className="bg-secondary5 w-[36px] h-[36px] flex justify-center items-center">
          <common.IconButton
            Icon={iconPaths.Search}
            iconAnimationType="scaleUp"
            iconButtonType={"primary"}
            iconProps={{ width: 12, height: 12 }}
          />
        </div>
        icon button
      </div>
      <common.Input
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
        }}
        maxLength={15}
        {...inputProps}
      />{" "}
      <common.TextArea
        value={textArea}
        onChange={(e) => {
          setTextArea(e.target.value);
        }}
        maxLength={60}
        {...textAreaProps}
      />
      <Dropdown value={iconInput}>
        <DropdownTrigger>
          <div>hu</div>
        </DropdownTrigger>
        <DropdownMenu></DropdownMenu>
      </Dropdown>
    </div>
  );
};
// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Example/common",
  component: Ex,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
} satisfies Meta<typeof Ex>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const commonProps: Story = {
  args: {
    iconButtonProps: { Icon: iconPaths.NaviArrow },
    inputProps: {},
    textAreaProps: {},
    buttonProps: {},
  },
};
