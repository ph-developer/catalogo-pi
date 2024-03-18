import {useEffect} from "react";

const defaultBgColor = '#f8fafc' // bg-slate-50

export const useBgColor = (hex: string | null = null) => {
    useEffect(() => {
        document.body.style.backgroundColor = hex ?? defaultBgColor

        return () => {
            document.body.style.backgroundColor = defaultBgColor
        }
    }, [hex]);
}