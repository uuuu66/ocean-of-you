import { ButtonSize, ButtonType } from "@/components/atoms/Button";
import { SvgIconProps } from "@/lib/interfaces";
import { getComponentTypeColor } from "@/styles/theme";
import React, { ButtonHTMLAttributes } from "react";
import { css, styled } from "styled-components";
const iconSizes: { [key in ButtonSize]: number } = {
  xl: 24,
  lg: 24,
  md: 24,
  sm: 16,
  xs: 14,
};
export type IconAnimationType = "scaleUp" | "rotate" | "fly" | "none";

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  iconAnimationType?: IconAnimationType;
  iconButtonType?: ButtonType;
  size?: ButtonSize;
  Icon: React.FC<SvgIconProps>;
  iconProps?: SvgIconProps;
}
const circleGap = 6;
const IconButton: React.FC<IconButtonProps> = (props) => {
  const {
    iconAnimationType = "none",
    iconButtonType = "primary",
    size = "md",
    Icon,
    iconProps,
    ...rest
  } = props;

  return (
    <IconWrapper
      iconAnimationType={iconAnimationType}
      iconButtonType={iconButtonType}
      iconProps={iconProps}
      {...rest}
    >
      {Icon && (
        <Icon width={iconSizes[size]} height={iconSizes[size]} {...iconProps} />
      )}
    </IconWrapper>
  );
};

export default IconButton;
const IconWrapper = styled.button.withConfig({
  shouldForwardProp: (props) =>
    props !== "iconAnimationType" &&
    props !== "iconButtonType" &&
    props !== "iconProps",
})<Pick<IconButtonProps, "iconAnimationType" | "iconButtonType" | "iconProps">>`
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
    stroke: ${({ iconButtonType, iconProps }) =>
      iconProps?.stroke || getComponentTypeColor(iconButtonType, 3)};
    fill: ${({ iconButtonType, iconProps }) =>
      iconProps?.fill || getComponentTypeColor(iconButtonType, 3)};
  }
  &:active {
    ${({ iconAnimationType }) => {
      switch (iconAnimationType) {
        case "scaleUp":
          return css`
            transform: scale(1.3);
          `;
        case "rotate":
          return css`
            transform: rotate(180deg);
          `;
        case "fly":
          return css`
            transform: scale(0.8) translateX(-10%, 10%);
          `;
        case "none":
        default:
          return css`
            transform: unset;
          `;
      }
    }};
    svg,
    path {
      stroke: ${({ iconButtonType, iconProps }) =>
        iconProps?.activeProps?.stroke ||
        getComponentTypeColor(iconButtonType, 5)};
      fill: ${({ iconButtonType, iconProps }) =>
        iconProps?.activeProps?.fill ||
        getComponentTypeColor(iconButtonType, 5)};
    }
  }
`;
