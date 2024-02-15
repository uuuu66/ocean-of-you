import { useDropdownContext } from "@/components/headless/Dropdown";
import React, { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {}

const DropdownMenu: React.FC<Props> = (props) => {
  const { children } = props;
  const { isOpen } = useDropdownContext();
  return (
    <div
      className={`${!isOpen ? "hidden" : "flex"} absolute z-10 w-full min-h-10`}
    >
      {children}
    </div>
  );
};

export default DropdownMenu;
