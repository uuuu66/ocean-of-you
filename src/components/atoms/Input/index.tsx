import { ComponentTypes, Sizes } from "@/lib/types";
import { getComponentTypeColor, theme } from "@/styles/theme";
import React, { InputHTMLAttributes } from "react";
import styled, { css } from "styled-components";

export type InputSize = Sizes;
export type InputType = ComponentTypes;
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  $inputSize?: InputSize;
  $inputType?: InputType;
}

const Input: React.FC<Partial<InputProps>> = ({
  $inputSize = "md",
  $inputType = "primary",
  children,
  ...props
}) => {
  return (
    <Wrapper>
      {$inputSize !== "xs" && <IconWrapper $inputType={$inputType} />}
      <StyledInput $inputSize={$inputSize} $inputType={$inputType} {...props} />
    </Wrapper>
  );
};

export default Input;
const Wrapper = styled.div`
  position: relative;
  float: left;
  display: flex;
  align-items: center;
`;

const IconWrapper = styled.div<Partial<InputProps>>`
  position: absolute;
  left: 4px;
  min-height: calc(100% - 8px);
  aspect-ratio: 1;
  border-radius: 999px;
  background-color: white;
`;
const StyledInput = styled.input<Partial<InputProps>>`
  height: 100%;
  width: 100%;
  outline: none;
  border-radius: 8px;
  background-color: ${({ $inputType }) =>
    getComponentTypeColor($inputType, 5) || "white"};
  color: ${({ $inputType }) => getComponentTypeColor($inputType, 0) || "white"};
  &::placeholder {
    color: ${({ $inputType }) =>
      getComponentTypeColor($inputType, 0) || "white"};
  }
  ${({ $inputSize }) => {
    switch ($inputSize) {
      case "xl":
        return css`
          padding: 10px 6px;
          padding-left: 54px;
          padding-bottom: 14px;
          font-size: 20px;
          line-height: 16px;
          border-radius: 999px;
        `;
      case "lg":
        return css`
          padding: 8px 8px;
          padding-left: 50px;
          padding-bottom: 12px;
          font-size: 18px;
          line-height: 18px;
          border-radius: 999px;
        `;
      case "md":
      default:
        return css`
          padding: 6px 6px;
          padding-left: 44px;
          padding-bottom: 10px;
          font-size: 16px;
          line-height: 10px;

          border-radius: 999px;
        `;
      case "sm":
        return css`
          padding: 4px 6px;
          padding-left: 34px;
          padding-bottom: 8px;
          font-size: 12px;
          line-height: 14px;

          border-radius: 999px;
        `;
      case "xs":
        return css`
          padding: 4px 6px;

          font-size: 10px;
          line-height: 10px;
          border-radius: 8px;
        `;
    }
  }}
`;
