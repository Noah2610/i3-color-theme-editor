import { Theme } from "./types";
import { defaultTheme } from "./defaultTheme";
import { merge } from "../util";

export function getTheme(): Theme {
    return merge(defaultTheme(), {});
}
