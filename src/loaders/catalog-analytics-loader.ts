import {LoaderFunction, LoaderFunctionArgs} from "react-router-dom";
import {analytics} from "@/lib/analytics.ts";

interface Args {
    catalogUrl: string
}

export const catalogAnalyticsLoader: LoaderFunction<Args> = async (args: LoaderFunctionArgs<Args>) => {
    const {catalogUrl} = args.params

    if (!catalogUrl) return null

    analytics.registerCatalogViewEvent(catalogUrl).then()

    return null
}