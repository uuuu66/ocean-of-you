"use client";
import IconButton, {
  IconButtonProps,
} from "@/components/common/IconButton/IconButton";
import { InputSize, InputType } from "@/components/common/Input";
import { SvgIconProps } from "@/lib/interfaces";
import { theme } from "@/styles/theme";
import { getComponentTypeColor, shouldForwardProp } from "@/lib/utils/style";
import React, { InputHTMLAttributes, useCallback, useState } from "react";
import styled, { css } from "styled-components";

const inputComponentSize: { [key in InputSize]: number } = {
  xl: 64,
  lg: 56,
  md: 48,
  sm: 40,
  xs: 32,
};
const iconComponentSize: { [key in InputSize]: number } = {
  xl: 32,
  lg: 28,
  md: 24,
  sm: 16,
  xs: 14,
};
const circleGap = 6;

export type IconAnimationType = "scaleDown" | "rotate" | "none";
export interface IconInputProps extends InputHTMLAttributes<HTMLInputElement> {
  isError?: boolean;
  inputSize?: InputSize;
  inputType?: InputType;
  isIconOpenButton?: boolean;
  iconAnimationType?: IconAnimationType;
  isIconLeft?: boolean;
  iconProps?: SvgIconProps;
  Icon: React.FC<SvgIconProps>;
  submitButton?: IconButtonProps;
}
interface StyledInputProps extends Partial<IconInputProps> {
  open?: boolean;
}
const IconInput: React.FC<Partial<IconInputProps>> = ({
  isError = false,
  inputSize = "md",
  inputType = "primary",
  isIconOpenButton = true,
  iconAnimationType = "none",
  isIconLeft = true,
  submitButton,
  iconProps,
  Icon,
  children,
  ...props
}) => {
  const [open, setOpen] = useState(!isIconOpenButton);
  const handleIconWrapperClick = useCallback(() => {
    if (isIconOpenButton) setOpen(!open);
  }, [open, isIconOpenButton]);
  return (
    <Wrapper isIconLeft={isIconLeft}>
      <IconWrapper
        inputType={inputType}
        iconProps={iconProps}
        iconAnimationType={iconAnimationType}
        onClick={handleIconWrapperClick}
        open={open}
        aria-expanded={open}
      >
        {Icon && (
          <Icon
            width={iconComponentSize[inputSize]}
            height={iconComponentSize[inputSize]}
          />
        )}
      </IconWrapper>
      <InputWrapper inputSize={inputSize} open={open}>
        {
          <StyledInput
            isIconLeft={isIconLeft}
            isError={isError}
            inputSize={inputSize}
            inputType={inputType}
            open={open}
            {...props}
          />
        }
        {submitButton && (
          <>
            <SubmitButton
              iconButtonType={inputType || "primary"}
              $inputSize={inputSize}
              size={inputSize}
              $isIconLeft={isIconLeft}
              iconProps={submitButton.iconProps}
              open={open}
              {...submitButton}
            />
          </>
        )}
      </InputWrapper>
    </Wrapper>
  );
};

export default IconInput;
const Wrapper = styled.div.withConfig({
  shouldForwardProp,
})<Pick<StyledInputProps, "isIconLeft">>`
  position: relative;
  float: left;
  display: flex;
  align-items: center;
  width: 100%;
  transform: ${({ isIconLeft }) =>
    isIconLeft ? `rotateY(0deg)` : `rotateY(180deg)`};
`;
const SubmitButton = styled(IconButton)<
  IconButtonProps & {
    open: boolean;
    $isIconLeft: boolean;
    $inputSize: InputSize;
  }
>`
  position: absolute;
  rotate: ${({ $isIconLeft }) => ($isIconLeft ? "0deg" : "y 180deg")};

  z-index: 0;
  right: ${circleGap}px;
  height: ${({ $inputSize }) =>
    inputComponentSize[$inputSize] - circleGap * 2}px;
`;
const IconWrapper = styled.button.withConfig({
  shouldForwardProp,
})<Partial<StyledInputProps>>`
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
  svg,
  path {
    stroke: ${({ inputType, iconProps }) =>
      iconProps?.stroke || getComponentTypeColor(inputType, 1)};
    fill: ${({ inputType, iconProps }) =>
      iconProps?.fill || getComponentTypeColor(inputType, 1)};
  }
  &:active {
    svg,
    path {
      stroke: ${({ inputType, iconProps }) =>
        iconProps?.activeProps?.stroke || getComponentTypeColor(inputType, 3)};
      fill: ${({ inputType, iconProps }) =>
        iconProps?.activeProps?.fill || getComponentTypeColor(inputType, 3)};
    }
    ${({ iconAnimationType, open }) => {
      switch (iconAnimationType) {
        case "rotate":
          return css`
            transform: ${open ? `rotate(180deg)` : "unset"};
          `;
        case "scaleDown":
          return css`
            svg {
              transition: transform 1.3s;
              transform: ${open ? `scale(0.9)` : "unset"};
            }
          `;
        case "none":
        default:
          return css`
            transform: unset;
          `;
      }
    }};
  }
`;
const InputWrapper = styled.div.withConfig({
  shouldForwardProp,
})<StyledInputProps>`
  will-change: auto;
  position: relative;
  width: ${({ open, inputSize = "md" }) =>
    open ? "100%" : `${inputComponentSize[inputSize]}px`};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  transition: width 0.5s;
`;
const StyledInput = styled.input.withConfig({
  shouldForwardProp,
})<StyledInputProps>`
  width: 100%;
  height: ${({ inputSize = "md" }) => inputComponentSize[inputSize]}px;
  outline: none;

  border-radius: 8px;
  transition: all 0.5s;
  transform: ${({ isIconLeft }) =>
    isIconLeft ? `rotateY(0deg)` : `rotateY(180deg)`};
  background-color: ${({ inputType }) =>
    getComponentTypeColor(inputType, 4) || "white"};
  color: ${({ inputType }) => getComponentTypeColor(inputType, 0) || "white"};
  &::placeholder {
    color: ${({ inputType }) => getComponentTypeColor(inputType, 0) || "white"};
  }

  ${({ inputSize = "md" }) => {
    return css`
      padding: 6px 0px;
      ${theme.fonts.small[inputSize]};
    `;
  }}
  padding-left:${({ inputSize = "md", isIconLeft, open }) =>
    `${
      inputComponentSize[inputSize] -
      (open ? -6 : !isIconLeft ? inputComponentSize[inputSize] - 6 : 6)
    }px`};
  padding-right: ${({ inputSize = "md", isIconLeft, open }) =>
    `${
      inputComponentSize[inputSize] -
      (open ? -6 : isIconLeft ? inputComponentSize[inputSize] - 6 : 6)
    }px`};

  ${({ isError }) => {
    if (isError)
      return css`
        box-shadow: 0px 0px 2px 1px ${theme.colors.mainRed};
      `;
    else
      return css`
        box-shadow: unset;
      `;
  }};
`;
