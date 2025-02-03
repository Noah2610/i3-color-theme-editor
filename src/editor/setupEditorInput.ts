import { Context } from "../context";
import { Color, Theme, updateTheme } from "../theme";
import {
    createUnsubs,
    expectEl,
    expectEls,
    getThemeValue,
    merge,
    RecursivePartial,
    safeObjectKeys,
    validateThemeKey,
} from "../util";

export function setupEditorInput(
    context: Context,
    editorEl: HTMLElement,
): () => void {
    const unsubs = createUnsubs();

    const handleInput = (event: Event) => {
        if (!event.target) {
            return null;
        }

        const formEl = expectEl(".editor-form", editorEl);
        const dataEditorTarget = formEl.getAttribute("data-editor-target");
        if (dataEditorTarget === null) {
            return null;
        }

        const checkboxEl = expectEl<HTMLInputElement>(
            "input#input-editor-equal-colors",
            editorEl,
        );
        const shouldUpdateEqualColors = checkboxEl.checked;

        const changedTheme = updateThemeColorFromEl(
            context.theme,
            event.target as HTMLInputElement,
            dataEditorTarget,
            { shouldUpdateEqualColors },
        );

        return changedTheme;
    };

    const inputOnChange = (event: Event) => {
        const changedTheme = handleInput(event);
        changedTheme && updateTheme(changedTheme, { onlyWhenChanged: false });
    };

    const inputOnInput = (event: Event) => {
        const changedTheme = handleInput(event);
        changedTheme &&
            updateTheme(changedTheme, {
                updateEditor: false,
                applyTheme: true,
                exportTheme: false,
            });
    };

    const inputEls = expectEls<HTMLInputElement>(
        ".editor-input input.input--color",
        editorEl,
    );
    for (const inputEl of inputEls) {
        inputEl.addEventListener("change", inputOnChange);
        inputEl.addEventListener("input", inputOnInput);

        unsubs.add(() => inputEl.removeEventListener("change", inputOnChange));
        unsubs.add(() => inputEl.removeEventListener("input", inputOnInput));
    }

    const formEl = expectEl(".editor-form", editorEl);

    const onFormSubmit = (event: Event) => event.preventDefault();

    formEl.addEventListener("submit", onFormSubmit);
    unsubs.add(() => formEl.removeEventListener("submit", onFormSubmit));

    // {{{ FORM ON CHANGE
    // const formOnChange = (_event: Event) => {
    //     const dataEditorTarget = formEl.getAttribute("data-editor-target");
    //     if (dataEditorTarget === null) {
    //         return;
    //     }
    //     const validatedThemeKey = validateThemeKey(
    //         context.theme,
    //         dataEditorTarget,
    //     );
    //     if (validatedThemeKey === null) {
    //         return null;
    //     }
    //     const [_themePartKey, _themeValueKey, currentThemeValue] =
    //         validatedThemeKey;

    //     const targetDataEditor =
    //         typeof currentThemeValue === "string" ? "color" : "colors";

    //     let changedTheme: RecursivePartial<Theme> = {};

    //     const inputColorEls = expectEls<HTMLInputElement>(
    //         `.editor-input[data-editor="${targetDataEditor}"] input.input--color`,
    //         editorEl,
    //     );
    //     for (const inputColorEl of inputColorEls) {
    //         changedTheme = merge(
    //             changedTheme,
    //             updateThemeColorFromEl(
    //                 context.theme,
    //                 inputColorEl,
    //                 dataEditorTarget,
    //             ),
    //         );
    //     }

    //     updateTheme(changedTheme);
    // };

    // formEl.addEventListener("change", formOnChange);
    // unsubs.push(() => formEl.removeEventListener("change", formOnChange));
    // }}}

    return unsubs.unsubAll;
}

function updateThemeColorFromEl(
    theme: Theme,
    inputEl: HTMLInputElement,
    themeTarget: string,
    { shouldUpdateEqualColors } = { shouldUpdateEqualColors: false },
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
                if (shouldUpdateEqualColors) {
                    changedTheme = merge(
                        changedTheme,
                        updateEqualThemeColors(
                            theme,
                            currentThemeValue,
                            newColorValue,
                        ),
                    );
                }
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
                if (shouldUpdateEqualColors) {
                    changedTheme = merge(
                        changedTheme,
                        updateEqualThemeColors(
                            theme,
                            currentThemeValue[editorColorType],
                            newColorValue,
                        ),
                    );
                }
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
