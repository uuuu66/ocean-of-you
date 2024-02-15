import colorTheme from "@/datas/color.json";
import fontTheme from "@/datas/font.json";

export type ColorThemeType = typeof colorTheme;
export type FontThemeType = typeof fontTheme;

export interface ThemeType {
  colors: ColorThemeType;
  fonts: FontThemeType;
}

export const theme: ThemeType = {
  colors: colorTheme,
  fonts: fontTheme,
};
