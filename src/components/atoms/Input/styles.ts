import { InputProps, InputSize } from "@/components/atoms/Input";
import { theme, getComponentTypeColor } from "@/styles/theme";
import { css, styled } from "styled-components";
interface StyledProps extends InputProps {
  hasSuffix: boolean;
  hasPrefix: boolean;
}
const inputSizes: { [key in InputSize]: number } = {
  xl: 64,
  lg: 56,
  md: 48,
  sm: 40,
  xs: 32,
};
export const Wrapper = styled.span.withConfig({
  shouldForwardProp: (props) => {
    return (
      props !== "inputType" &&
      props !== "inputSize" &&
      props !== "isError" &&
      props !== "hasSuffix" &&
      props !== "hasPrefix"
    );
  },
})<Partial<StyledProps>>`
  ${({
    isError,
    inputType = "gray",
    inputSize = "md",
    hasSuffix,
    hasPrefix,
  }) => {
    return css`
      display: flex;
      flex-direction: row;
      overflow: hidden;
      padding-right: ${hasSuffix ? "8px" : "0px"};
      padding-left: ${hasPrefix ? "8px" : "0px"};
      width: 100%;
      box-shadow: ${isError ? `0px 0px 1px 1px ${theme.colors.red5}` : "none"};
      border-radius: 12px;
      height: ${inputSizes[inputSize]}px;
      border: 2px solid
        ${isError
          ? getComponentTypeColor("red", 3)
          : getComponentTypeColor(inputType, inputType === "green" ? 2 : 4)};
    `;
  }}
`;
export const StyledComponent = styled.input.withConfig({
  shouldForwardProp: (props) => {
    return (
      props !== "inputType" && props !== "inputSize" && props !== "isError"
    );
  },
})<Partial<StyledProps>>`
  ${({ inputSize = "md" }) => {
    return css`
      flex-grow: 1;
      padding: 6px ${inputSizes[inputSize] / 4}px;
      outline: none;
      font-size: ${inputSizes[inputSize] / 4 + 4}px;
    `;
  }}
`;
