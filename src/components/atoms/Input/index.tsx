import { Sizes, ComponentTypes } from "@/lib/types";
import { getComponentTypeColor, theme } from "@/styles/theme";
import React, { InputHTMLAttributes } from "react";
import styled, { css } from "styled-components";
import { iconPaths } from "../../../../public/icons";
export type InputSize = Sizes;
export type InputType = ComponentTypes;
interface Props extends InputHTMLAttributes<HTMLInputElement> {
  inputType: InputType;
  inputSize: InputSize;
  isError: boolean;
  hasResetButton: boolean;
}
const inputSizes: { [key in InputSize]: number } = {
  xl: 64,
  lg: 56,
  md: 48,
  sm: 40,
  xs: 32,
};
const Input: React.FC<Partial<Props>> = ({ hasResetButton, ...props }) => {
  return (
    <Wrapper {...props} hasResetButton={hasResetButton}>
      <StyledComponent {...props} />
      {hasResetButton && (
        <span className="w-6 h-full flex justify-center items-center ">
          <iconPaths.Delete className="cursor-pointer" />
        </span>
      )}
    </Wrapper>
  );
};

export default Input;
const Wrapper = styled.span.withConfig({
  shouldForwardProp: (props) => {
    return (
      props !== "inputType" &&
      props !== "inputSize" &&
      props !== "isError" &&
      props !== "hasResetButton"
    );
  },
})<Partial<Props>>`
  ${({ isError, inputType = "gray", inputSize = "md", hasResetButton }) => {
    return css`
      display: flex;
      flex-direction: row;
      overflow: hidden;
      padding-right: ${hasResetButton ? "8px" : "0px"};
      width: 100%;
      box-shadow: ${isError ? `0px 0px 1px 1px ${theme.colors.red5}` : "none"};
      border-radius: 12px;
      height: ${inputSizes[inputSize]}px;
      border: 1px solid
        ${isError
          ? getComponentTypeColor("red", 3)
          : getComponentTypeColor(inputType, 4)};
    `;
  }}
`;
const StyledComponent = styled.input.withConfig({
  shouldForwardProp: (props) => {
    return (
      props !== "inputType" && props !== "inputSize" && props !== "isError"
    );
  },
})<Partial<Props>>`
  ${({ inputSize = "md" }) => {
    return css`
      flex-grow: 1;
      padding: 6px ${inputSizes[inputSize] / 4}px;
      outline: none;
      font-size: ${inputSizes[inputSize] / 4 + 4}px;
    `;
  }}
`;