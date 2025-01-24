import React from "react";

//chỗ này đáng ra là  nằm trong theem luôn mới hợp lí, mà ban đầu không tính tới
export const WidthContext = React.createContext<{ width: number, setWidth: React.Dispatch<React.SetStateAction<number>> }>({ width: window.innerWidth, setWidth: () => { } })
export default function WidthContextProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
    const [width, setWidth] = React.useState<number>(window.innerHeight)
    const timer = React.useRef<number | null>(null)
    React.useEffect(() => {
        const handleResize = () => {
            if (timer.current) clearTimeout(timer.current)
            timer.current = window.setTimeout(() => {
                setWidth(window.innerWidth)
            }, 300)
        }
        window.addEventListener("resize", handleResize)
        return () => window.addEventListener("resize", handleResize)
    })
    return <WidthContext.Provider value={{ width, setWidth }}>{children}</WidthContext.Provider>
}