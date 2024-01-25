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
        return theme.colors.primary6;
      case "secondary":
        return theme.colors.secondary6;
      case "green":
        return theme.colors.green6;
      case "warning":
        return theme.colors.red6;
    }
  };
  const getPurseSecondaryColor = (
    buttonType?: ButtonType,
    stage: number = 0
  ) => {
    switch (buttonType) {
      case "primary":
        return theme.colors.primaries[stage];
      case "secondary":
        return theme.colors.secondaries[stage];
      case "green":
        return theme.colors.greens[stage + 1];
      case "warning":
        return theme.colors.reds[stage];
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
        purseBlurLength: "25px",
        purseSecondaryColor: getPurseSecondaryColor(buttonType, 4),
      }}
      {...props}
    >
      {children}
      {(defaultAnimation === "purse" || pressAnimation === "purse") && (
        <PurseAnimationSecondary
          theme={{
            purseSecondaryColor: getPurseSecondaryColor(buttonType, 4),
            purseSpreadLength: "16px",
            purseBlurLength: "16px",
            purseScale: 1,
          }}
          buttonType={buttonType}
          variant={variant}
          className="purse-animation-secondary"
          defaultAnimation={defaultAnimation}
          pressAnimation={pressAnimation}
        />
      )}

      {(defaultAnimation === "purse" || pressAnimation === "purse") && (
        <PurseAnimationSecondary
          theme={{
            purseSecondaryColor: getPurseSecondaryColor(buttonType, 3),
            purseSpreadLength: "8px",
            purseBlurLength: "8px",
            purseScale: 1,
          }}
          buttonType={buttonType}
          variant={variant}
          style={{ zIndex: -1 }}
          className="purse-animation-fill"
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
  z-index: -4;

  ${({ defaultAnimation }) => {
    if (defaultAnimation !== "none" && !!defaultAnimation) {
      return css`
        ${animations.purseSecondary};
        animation-iteration-count: infinite;
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
  }};
  &:active {
    ${({ pressAnimation, buttonType }) => {
      switch (pressAnimation) {
        case "purse":
          return css`
            transition: box-shadow 1.5s;
            box-shadow: 0px 0px 0px 25px ${({ theme }) => theme.purseColor};
            ${animations.trembling};
            & > .purse-animation-secondary {
              transition: box-shadow 1.5s;
              box-shadow: 0px 0px 0px 12px
                ${({ theme }) => theme.purseSecondaryColor};
              background-color: transparent;
            }
            & {
              background-color: transparent;
              overflow: hidden;
            }
            & > .purse-animation-fill {
              transform: translateY(100%);
              background-color: ${({}) => getColor(buttonType)};
              z-index: 1;
              ${animations.fillBottomToTopFrames};
            }
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
  }
`;
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
const buttonVariantCss = (buttonType?: ButtonType, variant?: ButtonVariant) => {
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
