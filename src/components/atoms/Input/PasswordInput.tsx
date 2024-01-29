import { InputProps } from "@/components/atoms/Input";
import { Wrapper, StyledComponent } from "@/components/atoms/Input/styles";
import { getComponentTypeColor } from "@/styles/theme";
import { EyeClosedIcon, EyeNoneIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { iconPaths } from "../../../../public/icons";

const PasswordInput: React.FC<Partial<InputProps>> = ({
  prefixComp,
  suffix,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const handleClickIcon = () => {
    setIsVisible(!isVisible);
  };

  return (
    <Wrapper {...props} hasSuffix={true} hasPrefix={!!prefixComp}>
      {prefixComp && (
        <span className="w-6 h-full flex justify-center items-center ">
          {prefixComp}
        </span>
      )}

      <StyledComponent {...props} type={isVisible ? "" : "password"} />
      <span className="w-6 h-full flex justify-center items-center ">
        {!isVisible ? (
          <EyeClosedIcon
            width={20}
            height={20}
            onClick={handleClickIcon}
            className="cursor-pointer opacity-25 "
            stroke={getComponentTypeColor(
              props.inputType,
              props.inputType === "green" ? 0 : 1
            )}
            fill={"transparent"}
          />
        ) : (
          <iconPaths.EyeOpen
            width={24}
            height={24}
            onClick={handleClickIcon}
            className="cursor-pointer opacity-25"
            stroke={getComponentTypeColor(
              props.inputType,
              props.inputType === "green" ? 0 : 1
            )}
            fill={"transparent"}
          />
        )}
      </span>
    </Wrapper>
  );
};
export default PasswordInput;
