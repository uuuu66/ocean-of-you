import colorTheme from "@/datas/color.json";
import fontTheme from "@/datas/font.json";
import { ComponentType } from "@/lib/types";
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
export const getComponentTypeColor = (
  ComponentType?: ComponentType,
  stage: number = 0
) => {
  switch (ComponentType) {
    case "primary":
      return theme.colors.primaries[stage];
    case "secondary":
      return theme.colors.secondaries[stage];
    case "green":
      return theme.colors.greens[stage];
    case "red":
      return theme.colors.reds[stage];
    case "gray":
    default:
      return theme.colors.grays[stage];
  }
};
