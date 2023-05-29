import { StyleProp, TextStyle } from "react-native/types";

const tintColorLight = "#2f95dc";
const tintColorDark = "#fff";

export default {
  light: {
    text: "#000",
    background: "#fff",
    tint: tintColorLight,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#fff",
    background: "#000",
    tint: tintColorDark,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorDark,
  },
};

export const headerStyle = { backgroundColor: "#F0F3F4" };

export const headerTitleStyle: StyleProp<
  Pick<TextStyle, "fontFamily" | "fontSize" | "fontWeight"> & {
    color?: string | undefined;
  }
> = { fontWeight: "bold" };

export const headerTintColor = "#45494C";
