import { ValueOf } from "./valueOf";
import { Color, Colors, Theme } from "../theme";

export function validateThemeKey(
    theme: Theme,
    s: string,
):
    | [keyof Theme, keyof (Theme["bar"] & Theme["window"]), Color | Colors]
    | null {
    const [themePartKey, themeValueKey] = s.split(".");

    if (
        !themePartKey ||
        !themeValueKey ||
        !(themePartKey in theme) ||
        !(theme as any)[themePartKey] ||
        !(themeValueKey in (theme as any)[themePartKey]) ||
        !(theme as any)[themePartKey][themeValueKey]
    ) {
        return null;
    }

    const themeValue = (theme as any)[themePartKey][themeValueKey] as
        | Color
        | Colors;

    return [
        themePartKey as keyof Theme,
        themeValueKey as keyof ValueOf<Theme>,
        themeValue,
    ];
}

export function getThemeValue(
    theme: Theme,
    themePartKey: keyof Theme,
    themeValueKey: string,
): Color | Colors | undefined {
    return (theme as any)[themePartKey][themeValueKey];
}
