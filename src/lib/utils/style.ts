import { theme } from "@/styles/theme";
import { ComponentType } from "@/lib/types";
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
