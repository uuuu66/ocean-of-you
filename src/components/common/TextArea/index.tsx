import { ComponentType } from "@/lib/types";
import { getComponentTypeColor } from "@/lib/utils/style";
import animations from "@/styles/animations";
import { theme } from "@/styles/theme";
import React, {
  TextareaHTMLAttributes,
  useCallback,
  useEffect,
  useRef,
} from "react";
import styled, { css } from "styled-components";

export type TextAreaVariant = "DEFAULT" | "LINE";
export interface TextAreaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  isError: boolean;
  isResizeEnabled: boolean;
  textAreaType: ComponentType;
  textAreaVariant: TextAreaVariant;
}

const TextArea: React.FC<Partial<TextAreaProps>> = (props) => {
  const {
    isResizeEnabled = true,
    textAreaVariant = "DEFAULT",
    maxLength,
  } = props;
  const ref = useRef<HTMLTextAreaElement>(null);
  const handleResizeHeight = useCallback(() => {
    if (ref.current) {
      ref.current.style.height = "auto"; //height 초기화
      ref.current.style.height =
        ref.current.scrollHeight +
        (textAreaVariant === "DEFAULT" ? 15 : 8) +
        "px";
    }
  }, [textAreaVariant]);
  useEffect(() => {
    handleResizeHeight();
  }, [props.value, textAreaVariant, handleResizeHeight]);
  return (
    <Wrapper textAreaVariant={textAreaVariant} {...props}>
      <StyledComponent
        ref={ref}
        isResizeEnabled={
          textAreaVariant === "DEFAULT" ? isResizeEnabled : false
        }
        textAreaVariant={textAreaVariant}
        rows={1}
        {...props}
      />
      {maxLength && (
        <LimitLengthSpan
          length={props.value?.toString().length}
          maxLength={maxLength}
          textAreaVariant={textAreaVariant}
        >{`${props.value?.toString().length}/${maxLength}`}</LimitLengthSpan>
      )}
    </Wrapper>
  );
};

export default TextArea;
const Wrapper = styled.span.withConfig({
  shouldForwardProp: (props) =>
    props !== "isError" &&
    props !== "textAreaType" &&
    props !== "isResizeEnabled" &&
    props !== "textAreaVariant",
})<
  Pick<Partial<TextAreaProps>, "isError" | "textAreaType" | "textAreaVariant">
>`
  ${({ isError, textAreaType, textAreaVariant }) => css`
    position: relative;
    width: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding:3px 0px 1px 0px;
    overflow-x:hidden
    transition: all 1.3s;
    border-radius: ${textAreaVariant === "DEFAULT" ? "12px" : "0px"};
    box-shadow:${
      textAreaVariant === "LINE"
        ? "none"
        : `-2px 5px 0px 3px
      ${
        isError
          ? getComponentTypeColor("red", 3)
          : getComponentTypeColor(
              textAreaType,
              textAreaType === "green" ? 1 : 1
            )
      };`
    } 
    padding-bottom: ${textAreaVariant === "LINE" ? "0px" : "0px"};;
    border-top: 2px solid
      ${
        textAreaVariant === "LINE"
          ? "none"
          : isError
          ? getComponentTypeColor("red", 3)
          : getComponentTypeColor(
              textAreaType,
              textAreaType === "green" ? 2 : 3
            )
      };
    border-left: ${textAreaVariant === "LINE" ? "0px" : "2px"};
    border-right: ${textAreaVariant === "LINE" ? "0px" : "2px"};
    ${
      isError
        ? css`
            ${animations.tremblingX};
            animation-fill-mode: backwards;
            animation-iteration-count: 4;
          `
        : ""
    }
    border-bottom:${
      textAreaVariant === "LINE"
        ? `2px solid ${
            isError
              ? getComponentTypeColor("red", 3)
              : getComponentTypeColor(
                  textAreaType,
                  textAreaType === "green" ? 2 : 3
                )
          }`
        : "none"
    }
  `}
`;
const StyledComponent = styled.textarea.withConfig({
  shouldForwardProp: (props) =>
    props !== "isError" &&
    props !== "textAreaType" &&
    props !== "isResizeEnabled" &&
    props !== "textAreaVariant",
})<Partial<TextAreaProps>>`
  ${({ isResizeEnabled, textAreaVariant }) => {
    return css`
      outline: none;
      transition: all 0.2s;
      border-radius: ${textAreaVariant === "DEFAULT" ? "8px" : "0px"};
      padding: 8px 8px;
      ${theme.fonts.article["lg"]};
      resize: ${isResizeEnabled ? "both" : "none"};
      min-width: calc(100% - 2px);
      max-width: calc(100% - 2px);
      width: 100%;
      overflow-y: hidden;
      padding-bottom: ${textAreaVariant === "LINE" ? "0px" : "8px"};
    `;
  }}
`;
const LimitLengthSpan = styled.span.withConfig({
  shouldForwardProp: (props) => props !== "textAreaVariant",
})<{
  maxLength?: number;
  length?: number;
  textAreaVariant?: TextAreaVariant;
}>`
  position: absolute;
  bottom: ${({ textAreaVariant }) =>
    textAreaVariant === "DEFAULT" ? "-3px" : "-36px"};
  right: 8px;
  ${theme.fonts.small["xs"]};
  text-shadow: 0em -1px ${theme.colors.gray1};
  transform: scale(1) translateY(-14px);
  opacity: 0.7;
  color: ${({ length, maxLength }) =>
    (length || 1) > (maxLength || 0)
      ? theme.colors.mainRed
      : theme.colors.gray3};
`;
