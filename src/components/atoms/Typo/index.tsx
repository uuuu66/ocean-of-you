import { ColorThemeType, FontThemeType, theme } from "@/styles/theme";
import React, { HTMLAttributes } from "react";
import styled, { css } from "styled-components";

export interface TypoProps extends HTMLAttributes<HTMLSpanElement> {
  type: keyof FontThemeType;
  typoColor?: keyof ColorThemeType;
}

const Typo: React.FC<TypoProps> = (props) => {
  return <StyledComponent {...props} />;
};

export default Typo;
const StyledComponent = styled.span.withConfig({
  shouldForwardProp: (props) => props !== "typoColor",
})<TypoProps>`
  ${({ type, typoColor }) => {
    return css`
      ${theme.fonts[type]};
      color: ${!typoColor ? theme.colors.gray1 : theme.colors[typoColor]};
    `;
  }}
`;
