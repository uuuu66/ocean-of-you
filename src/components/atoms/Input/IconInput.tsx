import { ComponentTypes, Sizes } from "@/lib/types";
import { getComponentTypeColor, theme } from "@/styles/theme";
import React, { InputHTMLAttributes, useCallback, useState } from "react";
import styled, { css } from "styled-components";

const inputSizes: { [key in InputSize]: number } = {
  xl: 64,
  lg: 56,
  md: 48,
  sm: 40,
  xs: 32,
};
const circleGap = 6;
export type InputSize = Sizes;
export type InputType = ComponentTypes;
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  $inputSize?: InputSize;
  $inputType?: InputType;
  $isIconOpenButton?: boolean;
  Icon?: React.FC<React.SVGProps<SVGSVGElement>>;
}
interface StyledInputProps extends Partial<InputProps> {
  open?: boolean;
}
const IconInput: React.FC<Partial<InputProps>> = ({
  $inputSize = "md",
  $inputType = "primary",
  $isIconOpenButton = true,
  Icon,
  children,
  ...props
}) => {
  const [open, setOpen] = useState(!$isIconOpenButton);
  const handleIconWrapperClick = useCallback(() => {
    if ($isIconOpenButton) setOpen(!open);
  }, [open, $isIconOpenButton]);
  return (
    <Wrapper>
      <IconWrapper
        $inputType={$inputType}
        onClick={handleIconWrapperClick}
        open={open}
      >
        {Icon && (
          <Icon
            stroke={getComponentTypeColor($inputType, open ? 5 : 3)}
            fill={getComponentTypeColor($inputType, open ? 5 : 3)}
          />
        )}
      </IconWrapper>

      {
        <StyledInput
          $inputSize={$inputSize}
          $inputType={$inputType}
          open={open}
          {...props}
        />
      }
    </Wrapper>
  );
};

export default IconInput;
const Wrapper = styled.div`
  position: relative;
  float: left;
  display: flex;
  align-items: center;
`;

const IconWrapper = styled.div<Partial<StyledInputProps>>`
  position: absolute;
  left: ${`${circleGap}px`};
  min-height: calc(100% - ${circleGap * 2}px);
  aspect-ratio: 1;
  border-radius: 999px;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 1.3s;
  transform: ${({ open }) => (open ? `rotate(180deg)` : "unset")};
`;
const StyledInput = styled.input<StyledInputProps>`
  will-change: auto;
  width: ${({ open }) => (open ? "100%" : "0%")};
  height: ${({ $inputSize = "md" }) => inputSizes[$inputSize]}px;
  outline: none;
  border-radius: 8px;
  transition: all 0.3s;
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
          padding: 0px 6px;

          font-size: 20px;

          border-radius: 999px;
        `;
      case "lg":
        return css`
          padding: 0px 6px;

          font-size: 18px;

          border-radius: 999px;
        `;
      case "md":
      default:
        return css`
          padding: 0px 6px;
          font-size: 16px;
          border-radius: 999px;
        `;
      case "sm":
        return css`
          padding: 0px 6px;
          font-size: 12px;
          border-radius: 999px;
        `;
      case "xs":
        return css`
          padding: 0px 6px;
          font-size: 10px;
          border-radius: 8px;
        `;
    }
  }}
  padding-left:${({ $inputSize = "md", open }) =>
    `${inputSizes[$inputSize] - (open ? -6 : 6)}px`};
`;
