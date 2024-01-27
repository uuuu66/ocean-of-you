import { ButtonType } from "@/components/atoms/Button";
import { getComponentTypeColor, theme } from "@/styles/theme";
import React, { ButtonHTMLAttributes } from "react";
import { css, styled } from "styled-components";

export type IconAnimationType = "scaleUp" | "rotate" | "none";
type IconButtonType = ButtonType;
export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  $iconAnimationType?: IconAnimationType;
  $iconButtonType?: IconButtonType;
  Icon?: React.FC<React.SVGProps<SVGSVGElement>>;
}
const circleGap = 6;
const IconButton: React.FC<IconButtonProps> = (props) => {
  const { $iconAnimationType, $iconButtonType, Icon, ...rest } = props;

  return (
    <IconWrapper
      $iconAnimationType={$iconAnimationType}
      $iconButtonType={$iconButtonType}
      {...rest}
    >
      {Icon && <Icon />}
    </IconWrapper>
  );
};

export default IconButton;
const IconWrapper = styled.button<
  Pick<IconButtonProps, "$iconAnimationType" | "$iconButtonType">
>`
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

  svg {
    stroke: ${({ $iconButtonType }) =>
      getComponentTypeColor($iconButtonType, 3)};
  }
  &:active {
    ${({ $iconAnimationType }) => {
      switch ($iconAnimationType) {
        case "scaleUp":
          return css`
            transform: scale(1.3);
          `;
        case "rotate":
          return css`
            transform: rotate(180deg);
          `;
        case "none":
        default:
          return css`
            transform: unset;
          `;
      }
    }} svg {
      stroke: ${({ $iconButtonType }) =>
        getComponentTypeColor($iconButtonType, 5)};
    }
  }
`;
