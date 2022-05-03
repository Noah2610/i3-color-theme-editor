export interface Theme {
    bar: BarTheme;
    window: WindowTheme;
}

export interface BarTheme {
    /**
     * UNUSED
     *
     * Background color of the bar.
     */
    background: Color;
    /**
     * Text color to be used for the statusline.
     */
    statusline: Color;
    /**
     * UNUSED
     *
     * Text color to be used for the separator.
     */
    separator: Color;
    /**
     * Background color of the bar on the currently focused monitor output.
     * If not used, the color will be taken from background.
     */
    focused_background: BarColors;
    /**
     * Text color to be used for the statusline on the currently focused monitor
     * output. If not used, the color will be taken from statusline.
     */
    focused_statusline: BarColors;
    /**
     * Text color to be used for the separator on the currently focused monitor
     * output. If not used, the color will be taken from separator.
     */
    focused_separator: BarColors;
    /**
     * Border, background and text color for a
     * workspace button when the workspace has focus.
     */
    focused_workspace: BarColors;
    /**
     * Border, background and text color for a workspace button when the
     * workspace is active (visible) on some output, but the focus is on
     * another one. You can only tell this apart from the focused workspace
     * when you are using multiple monitors.
     */
    active_workspace: BarColors;
    /**
     * Border, background and text color for a workspace button when the
     * workspace does not have focus and is not active (visible) on any output.
     * This will be the case for most workspaces.
     */
    inactive_workspace: BarColors;
    /**
     * Border, background and text color for a workspace button when the
     * workspace contains a window with the urgency hint set.
     */
    urgent_workspace: BarColors;
    /**
     * UNUSED
     *
     * Border, background and text color for the binding mode indicator.
     * If not used, the colors will be taken from urgent_workspace.
     */
    binding_mode: BarColors;
}

export interface WindowTheme {
    /**
     * A client which currently has the focus.
     */
    focused: WindowColors;
    /**
     * A client which is the focused one of its container,
     * but it does not have the focus at the moment.
     */
    focused_inactive: WindowColors;
    /**
     * A client which is not the focused one of its container.
     */
    unfocused: WindowColors;
    /**
     * A client which has its urgency hint activated.
     */
    urgent: WindowColors;
    /**
     * Background and text color are used to draw placeholder
     * window contents (when restoring layouts).
     * Border and indicator are ignored.
     */
    placeholder: WindowColors;
    /**
     * Background color which will be used to paint the background of the
     * client window on top of which the client will be rendered.
     * Only clients which do not cover the whole area of this window expose
     * the color. Note that this colorclass only takes a single color.
     */
    background: Color;
}

export interface Colors {
    border: Color;
    background: Color;
    text: Color;
    /** UNUSED */
    indicator?: Color;
    /** UNUSED */
    child_border?: Color;
}

export interface BarColors extends Omit<Colors, "indicator" | "child_border"> {}

export interface WindowColors extends Colors {
    indicator: Color;
    child_border: Color;
}

export type Color = string;
