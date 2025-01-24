import React from 'react';
type Theme = "light" | "dark"
export const ThemeContext = React.createContext<{ theme: Theme, setTheme: React.Dispatch<React.SetStateAction<Theme>> }>({ theme: "light", setTheme: () => { } })
export default function ThemeProvider({ children }: { children: React.ReactNode }): React.ReactElement {
    const localTheme = localStorage.getItem("theme")
    const [theme, setTheme] = React.useState<Theme>(localTheme as Theme ?? "light")
    React.useEffect(() => {
        localStorage.setItem("theme", theme)
    }, [theme])
    return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}