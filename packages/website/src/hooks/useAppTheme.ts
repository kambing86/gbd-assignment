import {
  PaletteType,
  ThemeOptions,
  createMuiTheme,
  useMediaQuery,
} from "@material-ui/core";
import { useCallback, useEffect } from "react";
import { atom, useRecoilState } from "recoil";
import useStateWithRef from "./helpers/useStateWithRef";

const getTheme = (type: PaletteType) => {
  const options: ThemeOptions =
    type === "dark"
      ? {
          palette: {
            type,
            background: {
              default: "#121212",
            },
            primary: {
              contrastText: "rgba(0, 0, 0, 0.87)",
              dark: "rgb(100, 141, 174)",
              light: "rgb(166, 212, 250)",
              main: "#90caf9",
            },
            secondary: {
              contrastText: "rgba(0, 0, 0, 0.87)",
              dark: "rgb(170, 100, 123)",
              light: "rgb(246, 165, 192)",
              main: "#f48fb1",
            },
          },
        }
      : { palette: { type } };
  return createMuiTheme(options);
};

const THEME_TYPE_KEY = "themeType";

function getSavedType() {
  return localStorage.getItem(THEME_TYPE_KEY) as PaletteType | null;
}

const themeTypeState = atom<PaletteType>({
  key: THEME_TYPE_KEY,
  default: getSavedType() ?? "light",
});

// if user change the theme, it should save to localStorage and use it
// else will change the theme based on the machine dark mode
export const useAppTheme = () => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [themeType, setThemeType] = useRecoilState<PaletteType>(themeTypeState);
  const [theme, setTheme] = useStateWithRef(getTheme(themeType));
  useEffect(() => {
    if (getSavedType() !== null) return;
    if (prefersDarkMode) {
      setThemeType("dark");
    } else {
      setThemeType("light");
    }
  }, [prefersDarkMode, setThemeType]);
  useEffect(() => {
    if (themeType === "dark") {
      setTheme(getTheme("dark"));
    } else {
      setTheme(getTheme("light"));
    }
  }, [themeType, setTheme]);
  const toggleDarkMode = useCallback(() => {
    if (theme.current.palette.type === "light") {
      localStorage.setItem(THEME_TYPE_KEY, "dark");
      setThemeType("dark");
    } else {
      localStorage.setItem(THEME_TYPE_KEY, "light");
      setThemeType("light");
    }
  }, [theme, setThemeType]);
  // for debugging
  // useEffect(() => {
  //   // @ts-ignore
  //   window.theme = theme.current;
  // }, [theme, theme.current]);
  // useDebugValue(theme);
  return { theme: theme.current, toggleDarkMode };
};
