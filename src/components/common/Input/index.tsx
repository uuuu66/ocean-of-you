import { ComponentSize, ComponentType } from "@/lib/types";
import React, { InputHTMLAttributes } from "react";
import {
  Wrapper,
  StyledComponent,
  LimitLengthSpan,
} from "@/components/common/Input/styles";
import PasswordInput from "@/components/common/Input/PasswordInput";
import ResetInput from "@/components/common/Input/ResetInput";
export type InputSize = ComponentSize;
export type InputType = ComponentType;
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
