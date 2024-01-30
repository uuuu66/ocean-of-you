import Typo from "@/components/atoms/Typo";
import { FontThemeType, theme } from "@/styles/theme";
import React from "react";

interface Props {}

const fonts: React.FC<Props> = (props) => {
  const {} = props;
  const fontArray = Object.entries(theme.fonts).filter(
    ([key, value]) => typeof value === "string"
  );
  return (
    <div className="w-[1300px] flex flex-col gap-3 items-start">
      {fontArray?.map((font) => (
        <span className="flex flex-row gap-3" key={font[0]}>
          <Typo type={font[0] as keyof FontThemeType} typoColor={"gray1"}>
            {font[0]}
          </Typo>
          <Typo type={font[0] as keyof FontThemeType} typoColor={"gray7"}>
            {font[1] as string}
          </Typo>
        </span>
      ))}
    </div>
  );
};

export default fonts;
