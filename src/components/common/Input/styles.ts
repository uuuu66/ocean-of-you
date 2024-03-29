import { InputProps, InputSize, InputType } from "@/components/common/Input";
import { theme } from "@/styles/theme";
import { getComponentTypeColor } from "@/lib/utils/style";
import { css, styled } from "styled-components";
interface StyledProps extends InputProps {
  hasSuffix: boolean;
  hasPrefix: boolean;
}
const inputComponentSize: { [key in InputSize]: number } = {
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
      box-shadow: ${isError
        ? `-3px 3px 0px 3px ${theme.colors.red3}`
        : `-3px 3px 0px 3px ${getComponentTypeColor(
            inputType,
            inputType === "green" ? 2 : 4
          )}`};
      border-radius: 12px;
      height: ${inputComponentSize[inputSize]}px;
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
      padding: 6px ${inputComponentSize[inputSize] / 8}px;
      outline: none;
      ${theme.fonts.article[inputSize]};
    `;
  }}
`;
export const LimitLengthSpan = styled.span.withConfig({
  shouldForwardProp: (props) => props !== "inputType" && props !== "isError",
})<{
  isError?: boolean;
  maxLength?: number;
  length?: number;
  inputType?: InputType;
}>`
  position: absolute;
  border: 2px solid
    ${({ inputType, isError }) =>
      isError
        ? getComponentTypeColor("red", 3)
        : getComponentTypeColor(inputType, inputType === "green" ? 2 : 4)};
  border-bottom: none;
  padding: 0px 1px;
  border-radius: 7px 7px 0px 0px;
  top: -4px;
  right: 8px;
  ${theme.fonts.small.xs};
  transform: scale(0.9) translateY(-18px);
  opacity: 1;
  color: ${({ length, maxLength, isError }) =>
    isError
      ? theme.colors.mainRed
      : (length || 1) > (maxLength || 0)
      ? theme.colors.mainRed
      : theme.colors.gray3};
`;
