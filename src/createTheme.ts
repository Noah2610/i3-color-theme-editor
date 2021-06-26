import { BarColors, Color, Theme, WindowColors } from "./theme";

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
