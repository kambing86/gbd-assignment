import { PaletteType, ThemeOptions, useMediaQuery } from "@material-ui/core";
import { createTheme } from "@material-ui/core/styles";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { State } from "store";
import { DARK, LIGHT, themeActions } from "store/slices/theme.slice";

// set it here https://material-ui.com/customization/default-theme/
const getTheme = (themeType: PaletteType | null) => {
  const type = themeType === DARK ? DARK : LIGHT;
  const options: ThemeOptions =
    type === DARK
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
      : {
          palette: {
            type,
            action: {
              hover: "rgba(0, 0, 0, 0.1)",
              hoverOpacity: 0.1,
              selected: "rgba(0, 0, 0, 0.2)",
              selectedOpacity: 0.2,
            },
          },
        };
  return createTheme(options);
};

// if user change the theme, it should save to localStorage and use it
// else will change the theme based on the machine dark mode
export const useAppTheme = () => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const themeType = useSelector((state: State) => state.theme.themeType);
  const [theme, setTheme] = useState(getTheme(themeType));
  const dispatch = useDispatch();
  const toggleDarkMode = useCallback(() => {
    dispatch(themeActions.toggleTheme());
  }, [dispatch]);
  // if localStorage has no saved theme type, then set using media query
  useEffect(() => {
    if (!prefersDarkMode || themeType !== null) return;
    toggleDarkMode();
  }, [prefersDarkMode, themeType, toggleDarkMode]);
  useEffect(() => {
    if (themeType === DARK) {
      setTheme(getTheme(DARK));
    } else {
      setTheme(getTheme(LIGHT));
    }
  }, [themeType]);
  return { theme, toggleDarkMode };
};
