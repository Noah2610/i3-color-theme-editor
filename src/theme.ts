export interface Theme {
  bar: BarConfig;
  window: WindowConfig;
}

export interface BarConfig {
  /**
   * Background color of the bar.
   */
  background: Color;
  /**
   * Text color to be used for the statusline.
   */
  statusline: Color;
  /**
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
   * Border, background and text color for the binding mode indicator.
   * If not used, the colors will be taken from urgent_workspace.
   */
  binding_mode: BarColors;
}

export interface WindowConfig {
  /**
   * A client which currently has the focus.
   */
  "client.focused": WindowColors;
  /**
   * A client which is the focused one of its container,
   * but it does not have the focus at the moment.
   */
  "client.focused_inactive": WindowColors;
  /**
   * A client which is not the focused one of its container.
   */
  "client.unfocused": WindowColors;
  /**
   * A client which has its urgency hint activated.
   */
  "client.urgent": WindowColors;
  /**
   * Background and text color are used to draw placeholder
   * window contents (when restoring layouts).
   * Border and indicator are ignored.
   */
  "client.placeholder": WindowColors;
  /**
   * Background color which will be used to paint the background of the
   * client window on top of which the client will be rendered.
   * Only clients which do not cover the whole area of this window expose
   * the color. Note that this colorclass only takes a single color.
   */
  "client.background": Color;
}

export interface BarColors {
  border: Color;
  background: Color;
  text: Color;
}

export interface WindowColors {
  border: Color;
  background: Color;
  text: Color;
  indicator: Color;
  child_border: Color;
}

export type Color = string;

export function createTheme(): Theme {
  return {
    bar: {
      background: newColor(),
      statusline: newColor(),
      separator: newColor(),
      focused_background: newBarColors(),
      focused_statusline: newBarColors(),
      focused_separator: newBarColors(),
      focused_workspace: newBarColors(),
      active_workspace: newBarColors(),
      inactive_workspace: newBarColors(),
      urgent_workspace: newBarColors(),
      binding_mode: newBarColors(),
    },
    window: {
      "client.focused": newWindowColors(),
      "client.focused_inactive": newWindowColors(),
      "client.unfocused": newWindowColors(),
      "client.urgent": newWindowColors(),
      "client.placeholder": newWindowColors(),
      "client.background": newColor(),
    },
  };
}

function newColor(color: Color = "#000000"): Color {
  return color;
}

function newBarColors(color: Color = "#000000"): BarColors {
  return {
    background: color,
    text: color,
    border: color,
  };
}

function newWindowColors(color: Color = "#000000"): WindowColors {
  return {
    border: color,
    background: color,
    text: color,
    indicator: color,
    child_border: color,
  };
}
