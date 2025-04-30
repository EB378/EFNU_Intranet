// theme.ts
import { createTheme } from "@mui/material/styles";
import { RefineThemes } from "@refinedev/mui";

// Extend MUI's palette to include the custom "strong" property.
declare module "@mui/material/styles" {
  interface Palette {
    third: {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
    };
    fourth: {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
    };
    fifth: {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
    };
    strong: {
      default: string;
      opposite: string;
      black: string;
      white: string;
      nav: string;
    };
  }
  interface PaletteOptions {
    thrid?: {
      main?: string;
      light?: string;
      dark?: string;
      contrastText?: string;
    };
    fourth?: {
      main?: string;
      light?: string;
      dark?: string;
      contrastText?: string;
    };
    fifth?: {
      main?: string;
      light?: string;
      dark?: string;
      contrastText?: string;
    };
    strong?: {
      default?: string;
      opposite?: string;
      black: string;
      white: string;
      nav?: string;
    };
  }
}

// Light theme using RefineThemes.Blue.
export const lightTheme = createTheme(RefineThemes.Blue, {
  palette: {
    primary: {
      main: "#133c83",
      light: "#2F3558",
      dark: "#0F1228",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#FF914D", // Orange main
      light: "#FFB585",
      dark: "#D9743E",
      contrastText: "#000000",
    },
    third: {
      main: "#005F6B", // Teal main
      light: "#008592",
      dark: "#004953",
      contrastText: "#000000",
    },
    fourth: {
      main: "#E5E5E5", // Grey main
      light: "#F5F5F5",
      dark: "#CFCFCF",
      contrastText: "#000000",
    },
    fifth: {
      main: "#3FAF7D", // Emerald main
      light: "#60C89C",
      dark: "#2E8F63",
      contrastText: "#000000",
    },
    error: {
      main: "#f44336",
      light: "#e57373",
      dark: "#d32f2f",
      contrastText: "#ffffff",
    },
    warning: {
      main: "#ffa726",
      light: "#ffb74d",
      dark: "#f57c00",
      contrastText: "#ffa726",
    },
    info: {
      main: "#4fc3f7", // A slightly lighter info color for better visibility on dark backgrounds
      light: "#80dfff",
      dark: "#0288d1",
      contrastText: "#aaaaaa",
    },
    success: {
      main: "#66bb6a",
      light: "#81c784",
      dark: "#388e3c",
      contrastText: "#ffffff",
    },
    strong: {
      default: "#ffffff",
      opposite: "#000000",
      black: "#000000",
      white: "#ffffff",
      nav: "#0F1228",
    },
  },
  components: {
    MuiSnackbar: {
      styleOverrides: {
        root: {
          zIndex: 250000, // Higher than navbar
        },
      },
    },
  },
});

// Dark theme using RefineThemes.BlueDark.
export const darkTheme = createTheme(RefineThemes.BlueDark, {
  palette: {
    primary: {
      main: "#2676ff",
      light: "#adc9ff",
      dark: "#1B1F3B",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#FF914D", // Orange main
      light: "#FFB585",
      dark: "#D9743E",
      contrastText: "#ffffff",
    },
    third: {
      main: "#005F6B", // Teal main
      light: "#008592",
      dark: "#004953",
      contrastText: "#ffffff",
    },
    fourth: {
      main: "#E5E5E5", // Grey main
      light: "#F5F5F5",
      dark: "#CFCFCF",
      contrastText: "#ffffff",
    },
    fifth: {
      main: "#3FAF7D", // Emerald main
      light: "#60C89C",
      dark: "#2E8F63",
      contrastText: "#ffffff",
    },
    error: {
      main: "#f44336",
      light: "#e57373",
      dark: "#d32f2f",
      contrastText: "#ffffff",
    },
    warning: {
      main: "#ffa726",
      light: "#ffb74d",
      dark: "#f57c00",
      contrastText: "#ffa726",
    },
    info: {
      main: "#4fc3f7", // A slightly lighter info color for better visibility on dark backgrounds
      light: "#80dfff",
      dark: "#0288d1",
      contrastText: "#aaaaaa",
    },
    success: {
      main: "#66bb6a",
      light: "#81c784",
      dark: "#388e3c",
      contrastText: "#ffffff",
    },
    strong: {
      default: "#000000",
      opposite: "#ffffff",
      black: "#000000",
      white: "#ffffff",
      nav: "#0F1228",
    },
  },
  components: {
    MuiSnackbar: {
      styleOverrides: {
        root: {
          zIndex: 250000, // Higher than navbar
        },
      },
    },
  },
});

// Helper to get the theme based on mode.
export const getTheme = (mode: "light" | "dark") =>
  mode === "light" ? lightTheme : darkTheme;
