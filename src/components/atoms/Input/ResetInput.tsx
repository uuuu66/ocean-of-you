import { InputProps } from "@/components/atoms/Input";
import {
  Wrapper,
  StyledComponent,
  LimitLengthSpan,
} from "@/components/atoms/Input/styles";
import { getComponentTypeColor } from "@/styles/theme";
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
          width={24}
          height={24}
          className="cursor-pointer opacity-45 active:rotate-180 active:scale-90 transition-all"
          stroke={getComponentTypeColor(
            props.inputType,
            props.inputType === "green" ? 1 : 2
          )}
          onClick={handleClickReset}
        />{" "}
      </span>
      {maxLength > 0 && (
        <LimitLengthSpan
          maxLength={maxLength}
          length={props.value?.toString()?.length}
        >{`${props.value?.toString()?.length}/${maxLength}`}</LimitLengthSpan>
      )}
    </Wrapper>
  );
};
export default ResetInput;
