import { ColorThemeType, FontThemeType, theme } from "@/styles/theme";
import React, { HTMLAttributes } from "react";
import styled, { css } from "styled-components";

export interface TypoProps extends HTMLAttributes<HTMLSpanElement> {
  type: keyof FontThemeType;
  $color?: ColorThemeType;
}

const Typo: React.FC<TypoProps> = (props) => {
  return <StyledComponent {...props} />;
};

export default Typo;
const StyledComponent = styled.span<TypoProps>`
  ${({ type, $color }) => {
    return css`
      ${theme.fonts[type]};
      color: ${$color};
    `;
  }}
`;
