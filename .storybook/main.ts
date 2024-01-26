import type { StorybookConfig } from "@storybook/nextjs";
import path from "path";

const config: StorybookConfig = {
  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../src/**/story.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@storybook/addon-interactions",
  ],
  staticDirs: ["../public"],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  webpackFinal: async (config) => {
    if (!config.module || !config.module.rules) {
      return config;
    }

    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "@": path.resolve(__dirname, "../src"),
      };
    }
    //기존 svg
    const fileLoaderRule = config.module.rules.find(
      (rule) =>
        (rule as { test: any }).test &&
        (rule as { test: any })?.test.test(".svg")
    );
    (fileLoaderRule as { exclude: any }).exclude = /\.svg$/;
    config.module.rules.push({ test: /\.svg$/, use: ["@svgr/webpack"] });

    return config;
  },
};
export default config;
