import { Theme } from "./types";
import { defaultTheme } from "./defaultTheme";
import { merge } from "../util";

export function newTheme(): Theme {
    return defaultTheme();
}
