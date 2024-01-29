import { IconProps } from "@radix-ui/react-icons/dist/types";
import { RefAttributes, SVGProps } from "react";

type IconType = IconProps & RefAttributes<SVGSVGElement>;
export interface SvgIconProps extends IconType {
  activeProps?: SVGProps<HTMLOrSVGElement>;
}
