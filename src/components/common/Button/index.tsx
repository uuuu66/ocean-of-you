"use client";
import React, { ButtonHTMLAttributes } from "react";
import animations from "@/styles/animations";
import { theme } from "@/styles/theme";
import { getComponentTypeColor, shouldForwardProp } from "@/lib/utils/style";
import styled, { css } from "styled-components";
import { iconPaths } from "../../../../public/icons";
import { ComponentType, ComponentSize } from "@/lib/types";
import { Dongle } from "next/font/google";
import { onlyLowerCase } from "@/lib/utils/string";
export type ButtonType = ComponentType;
export type ButtonVariant = "default" | "outline" | "ghost";
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";
export type ButtonDefaultAnimation = "trembling" | "purse" | "none";
export type ButtonPressAnimation = "trembling" | "fill" | "scaleDown" | "none";
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  buttonType: ButtonType;
  variant: ButtonVariant;
  size: ButtonSize;
  fullWidth: boolean;
  defaultAnimation: ButtonDefaultAnimation;
  pressAnimation: ButtonPressAnimation;
  isLoading: boolean;
}

const buttonFont = Dongle({ weight: "400", subsets: ["latin"] });
const buttonHeight: { [key in ComponentSize]: number } = {
  xl: 72,
  lg: 64,
  md: 56,
  sm: 48,
  xs: 40,
};
const buttonRadius: { [key in ComponentSize]: number } = {
  xl: 12,
  lg: 12,
  md: 12,
  sm: 8,
  xs: 8,
};

const loadingButtonAnimationSize = 6;
const Button: React.FC<Partial<ButtonProps>> = ({
  buttonType = "primary",
  variant = "default",
  size = "md",
  fullWidth = false,
  defaultAnimation = "none",
  pressAnimation = "scaleDown",
  children,
  isLoading,
  ...props
}) => {
  return (
    <StyledComponent
      buttonType={buttonType}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      defaultAnimation={defaultAnimation}
      pressAnimation={pressAnimation}
      isLoading={isLoading}
      theme={{
        purseColor: getComponentTypeColor(buttonType, 5),
        purseBlurLength: "12px",
        purseSpreadLength: "12px",
      }}
      {...props}
    >
      {(isLoading || defaultAnimation !== "none") && (
        <AnimationComponent
          theme={{
            purseColor: getComponentTypeColor(buttonType, 4),
            purseSpreadLength: "10px",
            purseBlurLength: "10px",
            purseScale: 1,
            fromX: "-100px",
            toX: "100vw",
          }}
          buttonType={buttonType}
          variant={variant}
          className="animation-component animation-component-1"
          defaultAnimation={defaultAnimation}
        />
      )}
      {(isLoading || defaultAnimation !== "none") && (
        <AnimationComponent
          theme={{
            purseColor: getComponentTypeColor(buttonType, 3),
            purseSpreadLength: "8px",
            purseBlurLength: "6px",
            purseScale: 1,
            fromX: "3px",
            toX: "100vw",
          }}
          buttonType={buttonType}
          variant={variant}
          className="animation-component animation-component-2"
          defaultAnimation={defaultAnimation}
        />
      )}
      {(isLoading || pressAnimation !== "none") && (
        <AnimationComponent
          buttonType={buttonType}
          variant={variant}
          style={{ zIndex: -1 }}
          className="animation-component-fill"
          pressAnimation={pressAnimation}
        />
      )}{" "}
      <span className={buttonFont.className}>
        {isLoading ? (
          <iconPaths.Loading
            width={24}
            height={24}
            stroke={getSvgStrokeColor(buttonType)}
            fill={getSvgStrokeColor(buttonType)}
          />
        ) : (
          children
        )}
      </span>
    </StyledComponent>
  );
};

export default Button;
const AnimationComponent = styled.div.withConfig({
  shouldForwardProp,
})<
  Pick<
    Partial<ButtonProps>,
    "variant" | "buttonType" | "defaultAnimation" | "pressAnimation"
  >
>`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border-radius: 12px;
  z-index: -4;

  ${({ defaultAnimation }) => {
    if (defaultAnimation !== "none" && !!defaultAnimation) {
      return css`
        ${animations.purse};
        animation-iteration-count: infinite;
      `;
    }
  }}
`;
const StyledComponent = styled.button.withConfig({
  shouldForwardProp,
})<Partial<ButtonProps>>`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 3;
  transition: all 0.5s padding 0;
  min-width: 90px;
  & > span {
    position: relative;
    z-index: 1;
  }
  & > .animation-component-fill {
    transform: translateY(100%) scaleY(0);
    transition: transform 1.5s;
  }
  ${({ fullWidth }) => {
    if (fullWidth)
      return css`
        width: 100%;
      `;
    else
      return css`
        width: unset;
      `;
  }}
  ${({ size = "md" }) => {
    return css`
      height: ${buttonHeight[size]}px;
      min-height: ${buttonHeight[size]}px;
      border-radius: ${buttonRadius[size]}px;
      padding: 0px 12px;
      ${theme.fonts.button[size]};
    `;
  }}

   ${({ buttonType, variant }) => {
    return buttonVariantCss(buttonType, variant);
  }}

${({ buttonType, variant, isLoading }) => {
    if (isLoading) {
      return css`
        cursor: not-allowed;
        overflow: hidden;
        border-color: ${getComponentTypeColor(buttonType, 5)};
        transition: 0;
        & > .animation-component-1 {
          animation-name: none;
          background-color: ${variant !== "default"
            ? "transparent"
            : getComponentTypeColor(buttonType, 0)};

          width: calc(100% - ${loadingButtonAnimationSize * 2}px);
          height: calc(100% - ${loadingButtonAnimationSize * 2}px);
          top: ${loadingButtonAnimationSize}px;
          left: ${loadingButtonAnimationSize}px;
          z-index: 0;
          /* opacity: 0; */
        }
        & > .animation-component-2 {
          animation-name: none;
          background-color: transparent;
          transform: translate(-50%, 50%) rotate(450deg) scaleY(1);
          transform-origin: 100% 0%;
          border-radius: 0%;

          ${animations.rotateProgress};
        }
        & > .animation-component-2::after {
          content: " ";
          position: absolute;
          width: 100%;
          height: 30%;
          left: 0;
          top: -7px;
          background: ${variant !== "default"
            ? "transparent"
            : getComponentTypeColor(buttonType, 4)};
          box-shadow: ${variant !== "default"
            ? "none"
            : `0 0 50px 10px ${getComponentTypeColor(buttonType, 4)}`};
          opacity: 0.7;
        }
        svg {
          ${animations.rotate};
        }
        &:active {
          ${animations.tremblingX};
        }
      `;
    }
  }} 

  ${({ defaultAnimation }) => {
    switch (defaultAnimation) {
      case "purse":
        return css`
          ${animations.purse};
          animation-iteration-count: infinite;
        `;

      case "trembling":
        return css`
          ${animations.tremblingX}
          animation-duration: 0.3;
        `;
      case "none":
      default:
        return css``;
    }
  }};

  &:active {
    ${({ pressAnimation, buttonType, isLoading }) => {
      switch (pressAnimation) {
        case "fill":
          return css`
            animation-name: none;

            transition: box-shadow 1.5s cubic-bezier(0.215, 0.61, 0.355, 1);
            box-shadow: 0px 0px 50px 25px ${({ theme }) => theme.purseColor};
            ${animations.trembling};

            & {
              overflow: hidden;
            }
            & > .animation-component-fill {
              transform: translateY(0%) scale(1.3);
              background-color: ${({}) => getComponentTypeColor(buttonType, 3)};
              z-index: 1;
              border-radius: 0px;
            }
            & > .animation-component-2 {
              animation-name: ${isLoading ? animations.rotateProgress : "none"};
            }
          `;

        case "trembling":
          return css`
            ${animations.tremblingX}
            animation-duration: 0.3;
            & > .animation-component-2 {
              animation-name: ${isLoading ? animations.rotateProgress : "none"};
            }
          `;
        case "scaleDown":
          return css`
            animation-name: none;
            transition: transform 0.5s;
            transform: scaleY(0.95);

            & > .animation-component-1 {
              animation-name: none;
            }
            & > .animation-component-2 {
              animation-name: ${isLoading ? animations.rotateProgress : "none"};
            }
          `;
        case "none":
        default:
          return css``;
      }
    }};
  }
`;
const buttonVariantCss = (buttonType?: ButtonType, variant?: ButtonVariant) => {
  switch (variant) {
    case "default":
      return css`
        background-color: ${getButtonTypeMainColor(buttonType)};
        color: ${theme.colors.white};
      `;
    case "ghost":
      return css`
        color: ${getButtonTypeMainColor(buttonType)};
      `;
    case "outline":
      return css`
        border: 3px;
        border-style: solid;
        border-color: ${getButtonTypeMainColor(buttonType)};
        background-color: none;
        color: ${getButtonTypeMainColor(buttonType)};
      `;
  }
};

const getButtonTypeMainColor = (buttonType?: ButtonType) => {
  switch (buttonType) {
    case "green":
      return theme.colors.mainGreen;
    case "primary":
      return theme.colors.mainPrimary;
    case "secondary":
      return theme.colors.mainSecondary;
    case "red":
      return theme.colors.mainRed;
    case "gray":
    default:
      return theme.colors.mainGray;
  }
};

const getSvgStrokeColor = (buttonType?: ButtonType) => {
  return getComponentTypeColor(buttonType, 3);
};
