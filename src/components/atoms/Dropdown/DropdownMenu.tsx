import { useDropdownContext } from "@/components/atoms/Dropdown";
import React from "react";

interface Props {}

const DropdownMenu: React.FC<Props> = (props) => {
  const {} = props;
  const { isOpen } = useDropdownContext();
  return (
    <div
      className={`${!isOpen ? "hidden" : "flex"} absolute z-10 w-full min-h-10`}
    >
      hi
    </div>
  );
};

export default DropdownMenu;
