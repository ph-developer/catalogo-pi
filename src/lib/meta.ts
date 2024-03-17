export const meta = {
    setPageTitle: (title: string, overrideAppName: boolean = false) => {
        if (overrideAppName) {
            document.title = title
        } else {
            document.title = `${title} - Catálogo de Produtos`
        }
    }
}