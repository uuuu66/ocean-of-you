import animations from "@/styles/animations";
import { theme } from "@/styles/theme";
import React, { ButtonHTMLAttributes } from "react";
import styled, { css } from "styled-components";

export type ButtonType = "primary" | "secondary" | "green" | "warning";
export type ButtonVariant = "default" | "outline" | "ghost";
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";
export type ButtonAnimation = "progress" | "error" | "purse" | "none";
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  buttonType: ButtonType;
  variant: ButtonVariant;
  size: ButtonSize;
  fullWidth: boolean;
  defaultAnimation: ButtonAnimation;
  pressAnimation: ButtonAnimation;
}

const Button: React.FC<Partial<ButtonProps>> = ({
  buttonType = "primary",
  variant = "default",
  size = "md",
  fullWidth = false,
  defaultAnimation = "none",
  pressAnimation = "none",
  children,
  ...props
}) => {
  const getPurseColor = (buttonType?: ButtonType) => {
    switch (buttonType) {
      case "primary":
        return theme.colors.primary5;
      case "secondary":
        return theme.colors.secondary5;
      case "green":
        return theme.colors.green5;
      case "warning":
        return theme.colors.red5;
    }
  };
  const getPurseSecondaryColor = (buttonType?: ButtonType) => {
    switch (buttonType) {
      case "primary":
        return theme.colors.primary2;
      case "secondary":
        return theme.colors.secondary2;
      case "green":
        return theme.colors.green2;
      case "warning":
        return theme.colors.red2;
    }
  };
  return (
    <StyledComponent
      buttonType={buttonType}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      defaultAnimation={defaultAnimation}
      pressAnimation={pressAnimation}
      theme={{
        purseColor: getPurseColor(buttonType),
      }}
      {...props}
    >
      {children}
      {(defaultAnimation === "purse" || pressAnimation === "purse") && (
        <PurseAnimationSecondary
          theme={{ purseSecondaryColor: getPurseSecondaryColor(buttonType) }}
          buttonType={buttonType}
          variant={variant}
          defaultAnimation={defaultAnimation}
          pressAnimation={pressAnimation}
        />
      )}
    </StyledComponent>
  );
};

export default Button;
const PurseAnimationSecondary = styled.div<
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
  z-index: -3;

  ${({ defaultAnimation, pressAnimation }) => {
    if (!!defaultAnimation) {
      return css`
        ${animations.purseSecondary};
        animation-iteration-count: infinite;
      `;
    }
    if (!!pressAnimation) {
      return css`
        ${animations.purseSecondary};
        animation-fill-mode: backwards;
      `;
    }
  }}
`;
const StyledComponent = styled.button<Partial<ButtonProps>>`
  position: relative;
  z-index: 3;

  ${({ size }) => {
    switch (size) {
      case "xl":
        return css`
          padding: 16px 24px;
          font-size: 24px;
          line-height: 150%;
          font-weight: 700;
          border-radius: 12px;
        `;
      case "lg":
        return css`
          padding: 16px 22px;
          font-size: 20px;
          line-height: 150%;
          font-weight: 700;
          border-radius: 12px;
        `;
      case "md":
        return css`
          padding: 16px 20px;
          font-size: 18px;
          line-height: 150%;
          font-weight: 700;
          border-radius: 12px;
        `;
      case "sm":
        return css`
          padding: 14px 18px;
          font-size: 16px;
          line-height: 150%;
          font-weight: 700;
          border-radius: 12px;
        `;
      case "xs":
        return css`
          padding: 8px 12px;
          font-size: 14px;
          line-height: 150%;
          font-weight: 700;
          border-radius: 8px;
        `;
      default:
        return css`
          padding: 20px 16px;
          font-size: 16px;
          line-height: 16px;
          font-weight: 700;
          border-radius: 6px;
        `;
    }
  }}
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
   ${({ buttonType, variant }) => {
    return buttonVariantCss(buttonType, variant);
  }}

  ${({ defaultAnimation }) => {
    switch (defaultAnimation) {
      case "purse":
        return css`
          ${animations.purse};
          animation-iteration-count: infinite;
        `;
      case "progress":
        return css``;
      case "error":
        return css``;
      case "none":
      default:
        return css``;
    }
  }}
  ${({ pressAnimation }) => {
    switch (pressAnimation) {
      case "purse":
        return css`
          ${animations.purse};
          animation-fill-mode: backwards;
        `;
      case "progress":
        return css``;
      case "error":
        return css``;
      case "none":
      default:
        return css``;
    }
  }}
`;
const buttonVariantCss = (buttonType?: ButtonType, variant?: ButtonVariant) => {
  const getColor = (buttonType?: ButtonType) => {
    switch (buttonType) {
      case "green":
        return theme.colors.mainGreen;
      case "primary":
        return theme.colors.mainPrimary;
      case "secondary":
        return theme.colors.mainSecondary;
      case "warning":
      default:
        return theme.colors.mainRed;
    }
  };
  switch (variant) {
    case "default":
      return css`
        background-color: ${getColor(buttonType)};
        color: ${theme.colors.white};
      `;
    case "ghost":
      return css`
        color: ${getColor(buttonType)};
      `;
    case "outline":
      return css`
        border: 1px;
        border-style: solid;
        border-color: ${getColor(buttonType)};
        background-color: none;
        color: ${getColor(buttonType)};
      `;
  }
};
