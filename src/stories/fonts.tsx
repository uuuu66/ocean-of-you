import Typo from "@/components/atoms/Typo";
import { Sizes } from "@/lib/types";
import { FontThemeType, theme } from "@/styles/theme";
import React from "react";

interface Props {}

const fonts: React.FC<Props> = (props) => {
  const {} = props;
  ["button", {}];
  const fontArray = Object.entries(theme.fonts).reduce<
    [string, Sizes, string][]
  >((prev, next) => {
    const array: [string, Sizes, string][] = [...prev];
    Object.entries<string>(next[1]).forEach((value) => {
      array.push([next[0], value[0] as Sizes, value[1]]);
    });

    return array;
  }, []);

  return (
    <div className="w-[1300px] flex flex-col gap-3 items-start">
      {fontArray?.map((font) => (
        <span className="flex flex-row gap-3" key={font[0]}>
          <Typo
            type={font[0] as keyof FontThemeType}
            typoSize={font[1]}
            typoColor={"gray1"}
          >
            {font[0]}
          </Typo>
          <Typo
            type={font[0] as keyof FontThemeType}
            typoSize={font[1]}
            typoColor={"red3"}
          >
            {font[1]}
          </Typo>
          <Typo
            type={font[0] as keyof FontThemeType}
            typoSize={font[1]}
            typoColor={"gray7"}
          >
            {font[2] as string}
          </Typo>
        </span>
      ))}
    </div>
  );
};

export default fonts;
