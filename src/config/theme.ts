import type { ThemeConfig } from "antd";

export const appTheme: ThemeConfig = {
  token: {
    colorPrimary: "#4f6ef7",
    borderRadius: 12,
    colorBgLayout: "#f4f7fb",
    colorTextHeading: "#172033",
    colorTextDescription: "#64748b",
    fontFamily: "var(--font-geist-sans)",
  },
  components: {
    Segmented: {
      trackBg: "#e6ebf3",
      itemSelectedColor: "#4f6ef7",
      itemHoverBg: "rgba(255, 255, 255, 0.55)",
    },
  },
};
