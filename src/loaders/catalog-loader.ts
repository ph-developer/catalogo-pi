import {LoaderFunction, LoaderFunctionArgs} from "react-router-dom"
import {catalogRepository} from "@/repositories/catalog-repository.ts";
import {colors} from "@/lib/colors.ts";

interface Args {
    catalogName: string
}

export const catalogLoader: LoaderFunction = async ({params}: LoaderFunctionArgs<Args>) => {
    const {catalogName} = params

    if (!catalogName) return null

    const catalog = await catalogRepository.getCatalogByName(catalogName, ['categories', 'products'])

    if (catalog?.bannerDominantColor) {
        colors.setBackgroundColor(catalog.bannerDominantColor)
    }

    return catalog
}