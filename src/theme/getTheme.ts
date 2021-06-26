import { defaultTheme } from "./defaultTheme";
import { Theme } from "./types";

export function getTheme(): Theme {
    return defaultTheme();
}
