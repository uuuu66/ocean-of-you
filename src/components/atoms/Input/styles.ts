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
      position: relative;
      display: flex;
      flex-direction: row;
      padding-right: ${hasSuffix ? "8px" : "8px"};
      padding-left: ${hasPrefix ? "8px" : "8px"};
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
      padding: 6px ${inputSizes[inputSize] / 8}px;
      outline: none;
      font-size: ${inputSizes[inputSize] / 4 + 4}px;
    `;
  }}
`;
export const LimitLengthSpan = styled.span<{
  maxLength?: number;
  length?: number;
}>`
  position: absolute;
  top: 0px;
  right: 8px;
  font-size: 10px;
  transform: scale(0.9) translateY(-14px);
  opacity: 0.7;
  color: ${({ length, maxLength }) =>
    (length || 1) > (maxLength || 0)
      ? theme.colors.mainRed
      : theme.colors.gray3};
`;
