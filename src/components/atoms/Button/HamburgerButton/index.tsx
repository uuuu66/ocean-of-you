import { Sizes } from "@/lib/types";
import { theme } from "@/styles/theme";
import React, { ButtonHTMLAttributes } from "react";
import styled, { css } from "styled-components";

interface HamburgerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size: Sizes;
  isOpen: boolean;
}
const hamburgerButtonSize: { [key in Sizes]: number } = {
  xl: 72,
  lg: 66,
  md: 56,
  sm: 52,
  xs: 48,
};
const hambugerButtonLineHeight: { [key in Sizes]: number } = {
  xl: 4,
  lg: 4,
  md: 4,
  sm: 4,
  xs: 4,
};
const hambugerButtonPaddingY: { [key in Sizes]: number } = {
  xl: 18,
  lg: 16,
  md: 14,
  sm: 12,
  xs: 10,
};
const hambugerButtonPaddingX: { [key in Sizes]: number } = {
  xl: 24,
  lg: 22,
  md: 22,
  sm: 20,
  xs: 16,
};

const HamburgerButton: React.FC<Partial<HamburgerButtonProps>> = (props) => {
  const { size, isOpen } = props;
  return (
    <StyledComponent size={size} isOpen={isOpen}>
      <Line />
      <Line />
      <Line />
    </StyledComponent>
  );
};

export default HamburgerButton;

export const StyledComponent = styled.button.withConfig({
  shouldForwardProp: (props) => props !== "isOpen",
})<Partial<HamburgerButtonProps>>`
  ${({ size = "md", isOpen }) => css`
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    cursor: pointer;
    width: ${hamburgerButtonSize[size]}px;
    height: ${hamburgerButtonSize[size]}px;
    aspect-ratio: 1;
    border: 2px solid ${theme.colors.gray3};
    border-radius: 4px;
    overflow: hidden;
    & > span {
      position: absolute;
      display: block;
      width: calc(100% - ${hambugerButtonPaddingX[size]}px);
      height: ${hambugerButtonLineHeight[size]}px;
      background-color: ${theme.colors.gray3};
      top: calc(50% - ${hambugerButtonLineHeight[size] / 2}px);
    }
    & > span:nth-child(1) {
      transition: all 0.3s;
      transform: translateY(12px);
    }
    & > span:nth-child(2) {
      transition: all 0.3s 0.15s;
    }
    & > span:nth-child(3) {
      transition: all 0.3s 0.2s;
      transform: translateY(-12px);
    }

    &:active {
      & > span {
        background-color: ${theme.colors.gray7};
      }
    }
    ${isOpen &&
    css`
      & > span {
      }
      & > span:nth-child(1) {
        transition: transform 0.5s 1s background-color 0.5s;
        transform: translateY(0) rotate(225deg);
      }
      & > span:nth-child(2) {
        transition: transform 0.2s 0.12s;
        transform: scale(0);
      }
      & > span:nth-child(3) {
        transition: transform 0.5s;
        transform: translateY(0px) rotate(-225deg);
      }
    `}
  `}
`;
export const Line = styled.span.withConfig({
  shouldForwardProp: (props) => props !== "isOpen",
})<Pick<Partial<HamburgerButtonProps>, "size">>``;
