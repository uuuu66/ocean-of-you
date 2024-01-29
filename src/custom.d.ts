import { SvgIconProps } from "@/lib/interfaces";

declare module "*.svg" {
  import React from "react";
  const svg: React.FC<SvgIconProps>;
  export default svg;
}
