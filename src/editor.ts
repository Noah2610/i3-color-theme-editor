import { Context } from "./context";
import { updateTheme, Color, Colors, Theme } from "./theme";
import {
    expectEl,
    expectEls,
    merge,
    RecursivePartial,
    safeObjectKeys,
    ValueOf,
} from "./util";

export function setupEditor(context: Context): () => void {
    const rootEl = expectEl(".desktop");
    const editorEl = expectEl(".editor");
    const editableEls = rootEl.querySelectorAll<HTMLElement>(
        "[data-theme]:not(.--noedit)",
    );

    const unsubs: (() => void)[] = Array.from(editableEls)
        .map((el) => {
            return setupEditableListener(el, editorEl, context);
        })
        .filter((u) => !!u) as (() => void)[];

    unsubs.push(setupEditorForm(editorEl, context));
    unsubs.push(setupEditorControls(editorEl));

    return () => unsubs.forEach((unsub) => unsub());
}

function setupEditorForm(editorEl: HTMLElement, context: Context): () => void {
    const unsubs: (() => void)[] = [];

    const formEl = expectEl(".editor-form", editorEl);

    const inputOnChange = (event: Event) => {
        if (!event.target) {
            return;
        }

        console.log(context.theme);

        const formEl = expectEl(".editor-form", editorEl);
        const dataEditorTarget = formEl.getAttribute("data-editor-target");
        if (dataEditorTarget === null) {
            return;
        }
        const changedTheme = updateThemeColorFromEl(
            context.theme,
            event.target as HTMLInputElement,
            dataEditorTarget,
        );

        updateTheme(changedTheme);
    };

    const inputColorEls = expectEls<HTMLInputElement>(
        `.editor-input input.input--color`,
        editorEl,
    );
    for (const inputColorEl of inputColorEls) {
        inputColorEl.addEventListener("change", inputOnChange);
        unsubs.push(() =>
            inputColorEl.removeEventListener("change", inputOnChange),
        );
    }

    const onFormChange = (_event: Event) => {
        const dataEditorTarget = formEl.getAttribute("data-editor-target");
        if (dataEditorTarget === null) {
            return;
        }
        const validatedThemeKey = validateThemeKey(
            context.theme,
            dataEditorTarget,
        );
        if (validatedThemeKey === null) {
            return null;
        }
        const [_themePartKey, _themeValueKey, currentThemeValue] =
            validatedThemeKey;

        const targetDataEditor =
            typeof currentThemeValue === "string" ? "color" : "colors";

        let changedTheme: RecursivePartial<Theme> = {};

        const inputColorEls = expectEls<HTMLInputElement>(
            `.editor-input[data-editor="${targetDataEditor}"] input.input--color`,
            editorEl,
        );
        for (const inputColorEl of inputColorEls) {
            changedTheme = merge(
                changedTheme,
                updateThemeColorFromEl(
                    context.theme,
                    inputColorEl,
                    dataEditorTarget,
                ),
            );
        }

        updateTheme(changedTheme);
    };

    const onSubmit = (event: Event) => event.preventDefault();

    formEl.addEventListener("submit", onSubmit);
    unsubs.push(() => formEl.removeEventListener("submit", onSubmit));

    // formEl.addEventListener("change", onFormChange);
    // unsubs.push(() => formEl.removeEventListener("change", onFormChange));

    return () => unsubs.forEach((unsub) => unsub());
}

function updateThemeColorFromEl(
    theme: Theme,
    inputEl: HTMLInputElement,
    themeTarget: string,
): RecursivePartial<Theme> {
    let changedTheme: RecursivePartial<Theme> = {};

    const validatedThemeKey = validateThemeKey(theme, themeTarget);
    if (validatedThemeKey === null) {
        return changedTheme;
    }
    const [themePartKey, themeValueKey, currentThemeValue] = validatedThemeKey;

    const editorColorType = inputEl.getAttribute("data-editor-color");
    if (editorColorType === null) {
        return changedTheme;
    }
    const newColorValue = inputEl.value;

    switch (editorColorType) {
        case "color": {
            if (typeof currentThemeValue === "string") {
                if (!changedTheme[themePartKey]) {
                    changedTheme[themePartKey] = {};
                }
                (changedTheme as any)[themePartKey][themeValueKey] =
                    newColorValue;
                changedTheme = merge(
                    changedTheme,
                    updateEqualThemeColors(
                        theme,
                        currentThemeValue,
                        newColorValue,
                    ),
                );
            }
            break;
        }
        case "border":
        case "background":
        case "text": {
            if (typeof currentThemeValue !== "string") {
                if (!changedTheme[themePartKey]) {
                    changedTheme[themePartKey] = {};
                }
                if (!(changedTheme as any)[themePartKey][themeValueKey]) {
                    (changedTheme as any)[themePartKey][themeValueKey] = {};
                }
                (changedTheme as any)[themePartKey][themeValueKey][
                    editorColorType
                ] = newColorValue;
                changedTheme = merge(
                    changedTheme,
                    updateEqualThemeColors(
                        theme,
                        currentThemeValue[editorColorType],
                        newColorValue,
                    ),
                );
            }
            break;
        }
    }

    return changedTheme;
}

function updateEqualThemeColors(
    theme: Theme,
    oldColor: Color,
    newColor: Color,
): RecursivePartial<Theme> {
    const updatedTheme: RecursivePartial<Theme> = {};

    for (const themePartKey of safeObjectKeys(theme)) {
        const themePart = theme[themePartKey];
        for (const themeValueKey of Object.keys(themePart)) {
            const themeValue = getThemeValue(
                theme,
                themePartKey,
                themeValueKey,
            );
            switch (typeof themeValue) {
                case "undefined": {
                    return updatedTheme;
                }
                case "string": {
                    if (themeValue === oldColor) {
                        if (!updatedTheme[themePartKey]) {
                            updatedTheme[themePartKey] = {};
                        }
                        (updatedTheme as any)[themePartKey][themeValueKey] =
                            newColor;
                    }
                    break;
                }
                case "object": {
                    for (const colorKey of safeObjectKeys(themeValue)) {
                        const currColor = themeValue[colorKey];
                        if (currColor !== undefined && currColor === oldColor) {
                            if (!updatedTheme[themePartKey]) {
                                updatedTheme[themePartKey] = {};
                            }
                            if (
                                !(updatedTheme as any)[themePartKey][
                                    themeValueKey
                                ]
                            ) {
                                (updatedTheme as any)[themePartKey][
                                    themeValueKey
                                ] = {};
                            }
                            (updatedTheme as any)[themePartKey][themeValueKey][
                                colorKey
                            ] = newColor;
                        }
                    }
                    break;
                }
            }
        }
    }

    return updatedTheme;
}

function setupEditorControls(editorEl: HTMLElement): () => void {
    const onKey = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
            closeEditor(editorEl);
        }
    };

    document.addEventListener("keyup", onKey);

    return () => document.removeEventListener("keyup", onKey);
}

function setupEditableListener(
    editableEl: HTMLElement,
    editorEl: HTMLElement,
    context: Context,
): (() => void) | null {
    const dataTheme = editableEl.getAttribute("data-theme");
    if (dataTheme === null) {
        return null;
    }
    const validatedThemeKey = validateThemeKey(context.theme, dataTheme);
    if (validatedThemeKey === null) {
        return null;
    }
    const [themePartKey, themeValueKey] = validatedThemeKey;

    const unsubs: (() => void)[] = [];

    const listener = (event: MouseEvent) => {
        event.stopPropagation();

        openEditor(editorEl, event);

        const themeValue = getThemeValue(
            context.theme,
            themePartKey,
            themeValueKey,
        );

        const editorBar = expectEl(".window-bar", editorEl);
        editorBar.innerText = `${themePartKey} ${themeValueKey}`;

        let targetDataEditor: "color" | "colors";

        switch (typeof themeValue) {
            case "undefined": {
                return;
            }
            case "string": {
                targetDataEditor = "color";
                break;
            }
            case "object": {
                targetDataEditor = "colors";
                break;
            }
        }

        const editorInputEls = expectEls(".editor-input", editorEl);
        for (const editorEl of editorInputEls) {
            const dataEditor = editorEl.getAttribute("data-editor");
            if (dataEditor === null) {
                continue;
            }
            if (dataEditor === targetDataEditor) {
                editorEl.classList.remove("--hidden");
            } else {
                editorEl.classList.add("--hidden");
            }
        }

        const inputColorEls = expectEls<HTMLInputElement>(
            `.editor-input[data-editor="${targetDataEditor}"] input.input--color`,
            editorEl,
        );
        for (const inputColorEl of inputColorEls) {
            const dataEditorColor =
                inputColorEl.getAttribute("data-editor-color");
            if (dataEditorColor === null) {
                continue;
            }
            switch (dataEditorColor) {
                case "color": {
                    if (typeof themeValue === "string") {
                        inputColorEl.value = themeValue;
                    }
                    break;
                }
                case "border":
                case "background":
                case "text": {
                    if (typeof themeValue !== "string") {
                        inputColorEl.value = themeValue[dataEditorColor];
                    }
                    break;
                }
            }

            // inputColorEl.setAttribute("data-editor-target", dataTheme);
        }

        const editorFormEl = expectEl(".editor-form", editorEl);
        editorFormEl.setAttribute("data-editor-target", dataTheme);
    };

    editableEl.addEventListener("click", listener);
    unsubs.push(() => editableEl.removeEventListener("click", listener));

    return () => unsubs.forEach((unsub) => unsub());
}

function validateThemeKey(
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

function getThemeValue(
    theme: Theme,
    themePartKey: keyof Theme,
    themeValueKey: string,
): Color | Colors | undefined {
    return (theme as any)[themePartKey][themeValueKey];
}

const OPEN_EDITOR_URGENT_TIMEOUT_MS = 500;
let openEditorUrgentTimeoutId: NodeJS.Timeout | null = null;

function openEditor(editorEl: HTMLElement, event: MouseEvent) {
    const mousePos = {
        x: event.pageX,
        y: event.pageY,
    };

    editorEl.style.left = `${mousePos.x}px`;
    editorEl.style.top = `${mousePos.y}px`;

    editorEl.classList.add("--open", "--urgent");

    if (openEditorUrgentTimeoutId !== null) {
        clearTimeout(openEditorUrgentTimeoutId);
    }
    openEditorUrgentTimeoutId = setTimeout(() => {
        openEditorUrgentTimeoutId = null;
        editorEl.classList.remove("--urgent");
    }, OPEN_EDITOR_URGENT_TIMEOUT_MS);
}

function closeEditor(editorEl: HTMLElement) {
    editorEl.classList.remove("--open");
}
