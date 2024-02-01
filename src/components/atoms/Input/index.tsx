import { Sizes, ComponentTypes } from "@/lib/types";
import { getComponentTypeColor } from "@/styles/theme";
import React, { InputHTMLAttributes } from "react";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import {
  Wrapper,
  StyledComponent,
  LimitLengthSpan,
} from "@/components/atoms/Input/styles";
import PasswordInput from "@/components/atoms/Input/PasswordInput";
import ResetInput from "@/components/atoms/Input/ResetInput";
export type InputSize = Sizes;
export type InputType = ComponentTypes;
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  inputType: InputType;
  inputSize: InputSize;
  isError: boolean;
  isPassword: boolean;
  suffixComp: React.ReactNode;
  prefixComp: React.ReactNode;
  handleClickReset: React.MouseEventHandler;
}

const Input: React.FC<Partial<InputProps>> = ({
  prefixComp,
  suffixComp,
  isPassword,
  maxLength = 0,
  handleClickReset,
  ...props
}) => {
  if (handleClickReset)
    return (
      <ResetInput
        maxLength={maxLength}
        suffixComp={suffixComp}
        prefixComp={prefixComp}
        handleClickReset={handleClickReset}
        {...props}
      />
    );
  if (isPassword)
    return (
      <PasswordInput
        maxLength={maxLength}
        suffixComp={suffixComp}
        prefixComp={prefixComp}
        {...props}
      />
    );
  return (
    <Wrapper {...props} hasSuffix={!!suffixComp} hasPrefix={!!prefixComp}>
      {prefixComp && (
        <span className="w-6 h-full flex justify-center items-center ">
          {prefixComp}
        </span>
      )}
      <StyledComponent {...props} />
      {suffixComp && (
        <span className="w-6 h-full flex justify-center items-center ">
          {suffixComp}
        </span>
      )}
      {maxLength > 0 && (
        <LimitLengthSpan
          isError={props.isError}
          inputType={props.inputType}
          length={props?.value?.toString()?.length}
          maxLength={maxLength}
        >
          {" "}
          {props.isError
            ? "Error!"
            : `${props.value?.toString()?.length}/${maxLength}`}
        </LimitLengthSpan>
      )}
    </Wrapper>
  );
};

export default Input;
