import { InputProps } from "@/components/atoms/Input";
import {
  Wrapper,
  StyledComponent,
  LimitLengthSpan,
} from "@/components/atoms/Input/styles";
import { getComponentTypeColor, theme } from "@/styles/theme";
import { CrossCircledIcon } from "@radix-ui/react-icons";

const ResetInput: React.FC<Partial<InputProps>> = ({
  prefixComp,
  suffixComp,
  handleClickReset,
  maxLength = 0,
  ...props
}) => {
  return (
    <Wrapper {...props} hasSuffix={true} hasPrefix={!!prefixComp}>
      {prefixComp && (
        <span className="w-6 h-full flex justify-center items-center ">
          {prefixComp}
        </span>
      )}
      <StyledComponent {...props} />{" "}
      <span className="w-6 h-full flex justify-center items-center">
        <CrossCircledIcon
          width={18}
          height={18}
          className="cursor-pointer opacity-45 active:rotate-180 active:scale-90 transition-all"
          stroke={
            props.isError
              ? theme.colors.mainRed
              : getComponentTypeColor(
                  props.inputType,
                  props.inputType === "green" ? 1 : 2
                )
          }
          onClick={handleClickReset}
        />{" "}
      </span>
      {maxLength > 0 && (
        <LimitLengthSpan
          isError={props.isError}
          inputType={props.inputType}
          maxLength={maxLength}
          length={props.value?.toString()?.length}
        >
          {props?.isError
            ? "Error!"
            : `${props.value?.toString()?.length}/${maxLength}`}
        </LimitLengthSpan>
      )}
    </Wrapper>
  );
};
export default ResetInput;
