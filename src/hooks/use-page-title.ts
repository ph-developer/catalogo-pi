import {useEffect} from "react";

const appTitle = 'Catálogo de Produtos'

export const usePageTitle = (title: string | null = null) => {
    useEffect(() => {
        document.title = title ? `${title} - ${appTitle}` : appTitle

        return () => {
            document.title = appTitle
        }
    }, [title]);
}