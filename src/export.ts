import { Context } from "./context";
import { Color, Colors, Theme } from "./theme";
import {
    createUnsubs,
    expectEl,
    RecursivePartial,
    safeObjectKeys,
} from "./util";

export function setupExport(context: Context): () => void {
    const unsubs = createUnsubs();

    const btnEl = document.querySelector<HTMLElement>(
        ".export .export__button",
    );

    if (btnEl) {
        const onClick = (_event: Event) => exportConfig(context);

        btnEl.addEventListener("click", onClick);
        unsubs.add(() => btnEl.removeEventListener("click", onClick));
    }

    return unsubs.unsubAll;
}

export function exportConfig(context: Context) {
    const outputEl = expectEl<HTMLTextAreaElement>(".export .export__config");

    const config = getThemeConfig(context.theme);
    const configDisplay = getThemeConfigDisplay(config);

    outputEl.value = configDisplay;
}

interface ThemeConfig {
    bar: {
        colors: {
            background: string;
            statusline: string;
            separator: string;
            focused_background: string;
            focused_statusline: string;
            focused_separator: string;
            focused_workspace: string;
            active_workspace: string;
            inactive_workspace: string;
            urgent_workspace: string;
            binding_mode: string;
        };
    };
    "client.focused": string;
    "client.focused_inactive": string;
    "client.unfocused": string;
    "client.urgent": string;
    "client.placeholder": string;
    "client.background": string;
}

function getThemeConfig(theme: Theme): ThemeConfig {
    const config: RecursivePartial<ThemeConfig> = {};

    for (const partKey of safeObjectKeys(theme)) {
        for (const themeKey of safeObjectKeys(theme[partKey])) {
            const themeConfigValue = getThemeConfigValue(
                theme[partKey][themeKey],
            );
            switch (partKey) {
                case "bar": {
                    if (!config.bar) {
                        config.bar = {
                            colors: {},
                        };
                    }
                    config.bar!.colors![themeKey] = themeConfigValue;
                    break;
                }
                case "window": {
                    (config as any)[`client.${themeKey}`] = themeConfigValue;
                    break;
                }
            }
        }
    }

    return config as ThemeConfig;
}

function getThemeConfigValue(value: Color | Colors): string {
    switch (typeof value) {
        case "string": {
            return value;
        }
        case "object": {
            let base = `${value.border} ${value.background} ${value.text}`;
            if (
                value.indicator !== undefined &&
                value.child_border !== undefined
            ) {
                base += ` ${value.indicator} ${value.child_border}`;
            }
            return base;
        }
    }
}

function getThemeConfigDisplay(config: ThemeConfig): string {
    const PADDING = "  ";

    const getDisplayOf = (obj: Record<string, any>) => {
        let items: string[] = [];
        for (const key of safeObjectKeys(obj)) {
            const val = obj[key];
            switch (typeof val) {
                case "string": {
                    items.push(`${key} ${val}`);
                    break;
                }
                case "object": {
                    const nestedItems = getDisplayOf(val);
                    items.push(
                        `${key} {`,
                        ...nestedItems.map((i) => `${PADDING} ${i}`),
                        "}",
                    );
                    break;
                }
            }
        }
        return items;
    };

    return getDisplayOf(config).join("\n");
}
