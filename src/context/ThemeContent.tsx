import React from 'react';
type Theme = "light" | "dark"
export const ThemeContext = React.createContext<{ theme: Theme, setTheme: React.Dispatch<React.SetStateAction<Theme>> }>({ theme: "light", setTheme: () => { } })
export default function ThemeProvider({ children }: { children: React.ReactNode }): React.ReactElement {
    const [theme, setTheme] = React.useState<Theme>("light")
    return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}