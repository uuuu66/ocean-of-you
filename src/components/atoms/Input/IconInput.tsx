"use client";
import IconButton, {
  IconButtonProps,
} from "@/components/atoms/Button/IconButton";
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
export type IconAnimationType = "scaleUp" | "rotate" | "none";
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  $isError: boolean;
  $inputSize?: InputSize;
  $inputType?: InputType;
  $isIconOpenButton?: boolean;
  $iconAnimationType?: IconAnimationType;
  $isIconLeft?: boolean;
  Icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  $submitButton?: IconButtonProps;
}
interface StyledInputProps extends Partial<InputProps> {
  open?: boolean;
}
const IconInput: React.FC<Partial<InputProps>> = ({
  $isError = false,
  $inputSize = "md",
  $inputType = "primary",
  $isIconOpenButton = true,
  $iconAnimationType = "none",
  $isIconLeft = true,
  $submitButton,
  Icon,
  children,
  ...props
}) => {
  const [open, setOpen] = useState(!$isIconOpenButton);
  const handleIconWrapperClick = useCallback(() => {
    if ($isIconOpenButton) setOpen(!open);
  }, [open, $isIconOpenButton]);
  return (
    <Wrapper $isIconLeft={$isIconLeft}>
      <IconWrapper
        $inputType={$inputType}
        $iconAnimationType={$iconAnimationType}
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
      <InputWrapper $inputSize={$inputSize} open={open}>
        {
          <StyledInput
            $isIconLeft={$isIconLeft}
            $isError={$isError}
            $inputSize={$inputSize}
            $inputType={$inputType}
            open={open}
            {...props}
          />
        }
        {$submitButton && (
          <SubmitButton
            {...$submitButton}
            $inputSize={$inputSize}
            $isIconLeft={$isIconLeft}
            open={open}
          />
        )}
      </InputWrapper>
    </Wrapper>
  );
};

export default IconInput;
const Wrapper = styled.div<Pick<StyledInputProps, "$isIconLeft">>`
  position: relative;
  float: left;
  display: flex;
  align-items: center;
  transform: ${({ $isIconLeft }) =>
    $isIconLeft ? `rotateY(0deg)` : `rotateY(180deg)`};
`;
const SubmitButton = styled(IconButton)<{
  open: boolean;
  $isIconLeft: boolean;
  $inputSize: InputSize;
}>`
  position: absolute;
  z-index: 0;
  right: ${circleGap}px;
  transition: display 0s 1s;
  height: ${({ $inputSize }) => inputSizes[$inputSize] - circleGap * 2}px;
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
  z-index: 1;
  cursor: pointer;
  ${({ $iconAnimationType, open }) => {
    switch ($iconAnimationType) {
      case "rotate":
        return css`
          transform: ${open ? `rotate(180deg)` : "unset"};
        `;
      case "scaleUp":
        return css`
          svg {
            transition: transform 1.3s;
            transform: ${open ? `scale(1.3)` : "unset"};
          }
        `;
      case "none":
      default:
        return css`
          transform: unset;
        `;
    }
  }}
`;
const InputWrapper = styled.div<StyledInputProps>`
  position: relative;
  width: ${({ open, $inputSize = "md" }) =>
    open ? "100%" : `${inputSizes[$inputSize]}px`};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  transition: width 0.5s;
`;
const StyledInput = styled.input<StyledInputProps>`
  will-change: auto;
  width: 100%;
  height: ${({ $inputSize = "md" }) => inputSizes[$inputSize]}px;
  outline: none;
  z-index: -1;
  border-radius: 8px;
  transition: all 0.3s;
  transform: ${({ $isIconLeft }) =>
    $isIconLeft ? `rotateY(0deg)` : `rotateY(180deg)`};
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
  padding-left:${({ $inputSize = "md", $isIconLeft, open }) =>
    `${
      inputSizes[$inputSize] -
      (open ? -6 : !$isIconLeft ? inputSizes[$inputSize] - 6 : 6)
    }px`};
  padding-right: ${({ $inputSize = "md", $isIconLeft, open }) =>
    `${
      inputSizes[$inputSize] -
      (open ? -6 : $isIconLeft ? inputSizes[$inputSize] - 6 : 6)
    }px`};

  ${({ $isError }) => {
    if ($isError)
      return css`
        box-shadow: 0px 0px 2px 1px ${theme.colors.mainRed};
      `;
    else
      return css`
        box-shadow: unset;
      `;
  }}
`;
