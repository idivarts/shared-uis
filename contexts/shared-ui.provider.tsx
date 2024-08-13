import {
  useContext,
  createContext,
  type PropsWithChildren,
} from "react";
import Colors from "../constants/Colors";

type ThemeColors = {
  dark: {
    [key: string]: string,
  },
  light: {
    [key: string]: string,
  },
  regular: {
    [key: string]: string,
  },
}

interface SharedUIThemeContextProps {
  themeColors?: ThemeColors;
}

const SharedUIThemeContext = createContext<SharedUIThemeContextProps>({
  themeColors: Colors,
});

export const useSharedUIThemeContext = () => useContext(SharedUIThemeContext);

interface SharedUIThemeProviderProps extends PropsWithChildren {
  themeColors: ThemeColors;
}

export const SharedUIThemeProvider: React.FC<SharedUIThemeProviderProps> = ({
  themeColors = Colors,
  children,
}) => {
  return (
    <SharedUIThemeContext.Provider
      value={{
        themeColors,
      }}
    >
      {children}
    </SharedUIThemeContext.Provider>
  );
};
