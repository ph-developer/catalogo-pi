import {LoaderFunction, LoaderFunctionArgs} from "react-router-dom";
import {analytics} from "@/lib/analytics.ts";

interface Args {
    catalogUrl: string
    productId: string
}

export const productAnalyticsLoader: LoaderFunction<Args> = async (args: LoaderFunctionArgs<Args>) => {
    const {catalogUrl, productId} = args.params

    if (!catalogUrl || !productId) return null

    analytics.registerProductViewEvent(catalogUrl, productId).then()

    return null
}