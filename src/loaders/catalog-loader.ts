import {LoaderFunction, LoaderFunctionArgs} from "react-router-dom"
import {catalogRepository} from "@/repositories/catalog-repository.ts";

interface Args {
    catalogName: string
}

export const catalogLoader: LoaderFunction = async ({params}: LoaderFunctionArgs<Args>) => {
    const {catalogName} = params

    if (!catalogName) return null

    return catalogRepository.getCatalogByName(catalogName, ['categories', 'products'])
}