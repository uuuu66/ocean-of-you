import { useDropdownContext } from "@/components/headless/Dropdown";
import React, { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {}

const DropdownTrigger: React.FC<Props> = (props) => {
  const { handleClickTrigger } = useDropdownContext();
  return (
    <span className="cursor-pointer" onClick={handleClickTrigger}>
      {props.children}
    </span>
  );
};

export default DropdownTrigger;
