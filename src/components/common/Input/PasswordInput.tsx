import { InputProps } from "@/components/common/Input";
import {
  Wrapper,
  StyledComponent,
  LimitLengthSpan,
} from "@/components/common/Input/styles";
import { useEffect, useRef, useState } from "react";

import { lotties } from "../../../../public/lotties";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
interface PasswordInputProps extends InputProps {}

const PasswordInput: React.FC<Partial<PasswordInputProps>> = ({
  prefixComp,
  suffixComp,
  maxLength = 0,

  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const handleClickIcon = () => {
    setIsVisible(!isVisible);
  };
  useEffect(() => {
    lottieRef.current?.setSpeed(10);
    if (!isVisible) {
      lottieRef.current?.setDirection(-1);
      lottieRef.current?.play();
    } else {
      lottieRef.current?.setDirection(1);
      lottieRef.current?.play();
    }
  }, [isVisible]);

  return (
    <Wrapper {...props} hasSuffix={true} hasPrefix={!!prefixComp}>
      {prefixComp && (
        <span className="w-6 h-full flex justify-center items-center ">
          {prefixComp}
        </span>
      )}
      <StyledComponent {...props} type={isVisible ? "" : "password"} />
      <span
        className={
          "w-11 h-full flex justify-center items-center overflow-hidden cursor-pointer "
        }
        onClick={handleClickIcon}
      >
        <Lottie
          className="h-full aspect-square absolute bottom-0 right-1 pt-1 pb-0"
          animationData={lotties["CatDown"]}
          lottieRef={lottieRef}
          loop={false}
        />
      </span>
      {maxLength > 0 && (
        <LimitLengthSpan
          isError={props.isError}
          inputType={props.inputType}
          maxLength={maxLength}
          length={props.value?.toString()?.length}
        >
          {" "}
          {props.isError
            ? "Error!"
            : `${props.value?.toString()?.length}/${maxLength}`}
        </LimitLengthSpan>
      )}
    </Wrapper>
  );
};
export default PasswordInput;
