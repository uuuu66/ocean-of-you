import React, { ButtonHTMLAttributes } from "react";
import animations from "@/styles/animations";
import { theme } from "@/styles/theme";
import Image from "next/image";
import styled, { css } from "styled-components";
import { paths } from "../../../../public/icons";

export type ButtonType = "primary" | "secondary" | "green" | "warning";
export type ButtonVariant = "default" | "outline" | "ghost";
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";
export type ButtonAnimation = "trembling" | "purse" | "none";
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  buttonType: ButtonType;
  variant: ButtonVariant;
  size: ButtonSize;
  fullWidth: boolean;
  defaultAnimation: ButtonAnimation;
  pressAnimation: ButtonAnimation;
  isLoading: boolean;
}

const Button: React.FC<Partial<ButtonProps>> = ({
  buttonType = "primary",
  variant = "default",
  size = "md",
  fullWidth = false,
  defaultAnimation = "none",
  pressAnimation = "none",
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
        purseColor: getButtonTypeColor(buttonType, 5),
        purseBlurLength: "25px",
      }}
      {...props}
    >
      {(isLoading || defaultAnimation !== "none") && (
        <AnimationComponent
          theme={{
            purseColor: getButtonTypeColor(buttonType, 4),
            purseSpreadLength: "16px",
            purseBlurLength: "16px",
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
            purseColor: getButtonTypeColor(buttonType, 3),
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
      <span>
        {isLoading ? (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="Icon/Interface/Loading">
              <path
                id="Ellipse 156"
                d="M12 3.75316C12 3.3372 12.3378 2.99672 12.7523 3.03149C14.3451 3.16509 15.8786 3.72109 17.1917 4.64836C18.7104 5.72088 19.8597 7.23745 20.4816 8.98963C21.1035 10.7418 21.1675 12.6436 20.6647 14.4336C20.162 16.2236 19.1172 17.814 17.6739 18.9862C16.2307 20.1583 14.4599 20.8547 12.6048 20.9797C10.7497 21.1046 8.90147 20.6519 7.31409 19.6839C5.72671 18.7159 4.47809 17.2799 3.73985 15.5735C3.1016 14.0982 2.87193 12.4833 3.06785 10.8969C3.11883 10.4841 3.52136 10.2233 3.92847 10.3086C4.33559 10.3939 4.59245 10.7931 4.54842 11.2068C4.41211 12.4872 4.60771 13.7858 5.12235 14.9754C5.73703 16.3962 6.77666 17.5918 8.09837 18.3978C9.42007 19.2039 10.959 19.5808 12.5036 19.4767C14.0482 19.3727 15.5226 18.7929 16.7243 17.8169C17.926 16.8409 18.7959 15.5167 19.2145 14.0263C19.6331 12.5359 19.5799 10.9524 19.062 9.49348C18.5442 8.03456 17.5873 6.77181 16.3227 5.8788C15.264 5.13112 14.0331 4.67334 12.7519 4.54414C12.3381 4.5024 12 4.16912 12 3.75316Z"
                fill={getButtonTypeColor(buttonType, 5)}
              />
            </g>
          </svg>
        ) : (
          children
        )}
      </span>
    </StyledComponent>
  );
};

export default Button;
const AnimationComponent = styled.div<
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
const StyledComponent = styled.button<Partial<ButtonProps>>`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 3;
  transition: all 0.5s;

  & > span {
    position: relative;
    z-index: 1;
  }
  & > .animation-component-fill {
    transform: translateY(100%) scaleY(0);
    transition: transform 1.5s;
  }
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

${({ buttonType, variant, isLoading }) => {
    if (isLoading) {
      return css`
        cursor: not-allowed;
        overflow: hidden;
        min-width: 80px;
        border-color: ${getButtonTypeColor(buttonType, 5)};

        & > .animation-component-1 {
          animation-name: none;
          background-color: ${variant !== "default"
            ? "transparent"
            : getButtonTypeColor(buttonType, 0)};

          width: calc(100% - 8px);
          height: calc(100% - 8px);
          top: 4px;
          left: 4px;
          z-index: 0;
        }
        & > .animation-component-2 {
          animation-name: none;
          background-color: ${variant !== "default"
            ? "transparent"
            : getButtonTypeColor(buttonType, 3)};

          ${animations.rotateProgress};
        }
        & > span > svg {
          ${animations.rotate}
        }

        &:active {
          cursor: not-allowed;
          overflow: hidden;
          min-width: 80px;
          border-color: ${getButtonTypeColor(buttonType, 5)};
          ${animations.tremblingX};
          & > .animation-component-1 {
            animation-name: none;
            background-color: ${variant !== "default"
              ? "transparent"
              : getButtonTypeColor(buttonType, 0)};

            width: calc(100% - 8px);
            height: calc(100% - 8px);
            top: 4px;
            left: 4px;
            z-index: 0;
          }
          & > .animation-component-2 {
            animation-name: none;
            background-color: ${variant !== "default"
              ? "transparent"
              : getButtonTypeColor(buttonType, 3)};

            ${animations.rotateProgress};
          }
          & > span > svg {
            ${animations.rotate}
          }
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
    ${({ pressAnimation, buttonType }) => {
      switch (pressAnimation) {
        case "purse":
          return css`
            animation-name: none;
            & > .animation-component {
              animation-name: none;
            }
            transition: box-shadow 1.5s cubic-bezier(0.215, 0.61, 0.355, 1);
            box-shadow: 0px 0px 50px 25px ${({ theme }) => theme.purseColor};
            ${animations.trembling};

            & {
              overflow: hidden;
            }
            & > .animation-component-fill {
              transform: translateY(0%) scale(1.3);
              background-color: ${({}) => getButtonTypeColor(buttonType, 4)};
              z-index: 1;
              border-radius: 0px;
            }
          `;

        case "trembling":
          return css`
            ${animations.tremblingX}
            animation-duration: 0.3;
            & > .animation-component {
              animation-name: none;
            }
          `;
        case "none":
        default:
          return css``;
      }
    }};
  }
`;
const getButtonTypeMainColor = (buttonType?: ButtonType) => {
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
        background-color: ${getButtonTypeMainColor(buttonType)};
        color: ${theme.colors.white};
      `;
    case "ghost":
      return css`
        color: ${getButtonTypeMainColor(buttonType)};
      `;
    case "outline":
      return css`
        border: 1px;
        border-style: solid;
        border-color: ${getButtonTypeMainColor(buttonType)};
        background-color: none;
        color: ${getButtonTypeMainColor(buttonType)};
      `;
  }
};

const getButtonTypeColor = (buttonType?: ButtonType, stage: number = 0) => {
  switch (buttonType) {
    case "primary":
      return theme.colors.primaries[stage];
    case "secondary":
      return theme.colors.secondaries[stage];
    case "green":
      return theme.colors.greens[stage];
    case "warning":
      return theme.colors.reds[stage];
  }
};
