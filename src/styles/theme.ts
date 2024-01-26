import colorTheme from "@/datas/color.json";
import { ComponentTypes } from "@/lib/types";

export type ColorThemeType = typeof colorTheme;

export interface ThemeType {
  colors: ColorThemeType;
}

export const theme: ThemeType = {
  colors: colorTheme,
};
export const getComponentTypeColor = (
  componentTypes?: ComponentTypes,
  stage: number = 0
) => {
  switch (componentTypes) {
    case "primary":
      return theme.colors.primaries[stage];
    case "secondary":
      return theme.colors.secondaries[stage];
    case "green":
      return theme.colors.greens[stage];
    case "red":
      return theme.colors.reds[stage];
  }
};
