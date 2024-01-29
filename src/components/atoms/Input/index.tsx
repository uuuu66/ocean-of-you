import { Sizes, ComponentTypes } from "@/lib/types";
import { getComponentTypeColor } from "@/styles/theme";
import React, { InputHTMLAttributes } from "react";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { Wrapper, StyledComponent } from "@/components/atoms/Input/styles";
import PasswordInput from "@/components/atoms/Input/PasswordInput";
import ResetInput from "@/components/atoms/Input/ResetInput";
export type InputSize = Sizes;
export type InputType = ComponentTypes;
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  inputType: InputType;
  inputSize: InputSize;
  isError: boolean;
  isPassword: boolean;
  suffix: React.ReactNode;
  prefixComp: React.ReactNode;
  handleClickReset: React.MouseEventHandler;
}

const Input: React.FC<Partial<InputProps>> = ({
  prefixComp,
  suffix,
  isPassword,
  handleClickReset,
  ...props
}) => {
  if (handleClickReset)
    return (
      <ResetInput
        prefixComp={prefixComp}
        handleClickReset={handleClickReset}
        {...props}
      />
    );
  if (isPassword) return <PasswordInput prefixComp={prefixComp} {...props} />;
  return (
    <Wrapper {...props} hasSuffix={!!suffix} hasPrefix={!!prefixComp}>
      {prefixComp && (
        <span className="w-6 h-full flex justify-center items-center ">
          {prefixComp}
        </span>
      )}
      <StyledComponent {...props} />
      {suffix && (
        <span className="w-6 h-full flex justify-center items-center ">
          {suffix}
        </span>
      )}
    </Wrapper>
  );
};

export default Input;
