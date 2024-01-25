import colorTheme from "@/datas/color.json";

export type ColorThemeType = typeof colorTheme;

export interface ThemeType {
  colors: ColorThemeType;
}

export const theme: ThemeType = {
  colors: colorTheme,
};
