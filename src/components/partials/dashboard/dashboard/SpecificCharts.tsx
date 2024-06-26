import {
    CatalogViewsAndVisitorsCardChart
} from "@/components/partials/dashboard/dashboard/charts/specific/CatalogViewsAndVisitorsCardChart.tsx";
import {
    CatalogUserDevicesCardChart
} from "@/components/partials/dashboard/dashboard/charts/specific/CatalogUserDevicesCardChart.tsx";
import { CatalogTextDisplay } from "./charts/specific/CatalogTextDisplay";
import {Catalog} from "@/types/catalog";
import {
    ProductViewsCardChart
} from "@/components/partials/dashboard/dashboard/charts/specific/ProductViewsCardChart.tsx";
import {useAnalytics} from "@/hooks/use-analytics.ts";
import {useProducts} from "@/hooks/use-products.ts";

interface Props {
    catalog: Catalog
}

export const SpecificCharts = ({catalog}: Props) => {
    const {catalogViewEvents, productViewEvents} = useAnalytics(catalog.id)
    const {products} = useProducts(catalog.productIds)

    return (
        <>
            {!!catalog.id && (
                <>
                    <CatalogTextDisplay label="Produtos" value={catalog.productIds.length}/>
                    <CatalogTextDisplay label="Categorias" value={catalog.categoryIds.length}/>
                    <div className="w-0 lg:w-1/2 h-[6.5rem]" />
                    {!!catalog.productIds.length && (
                        <ProductViewsCardChart productViewEvents={productViewEvents} products={products} />
                    )}
                    <CatalogViewsAndVisitorsCardChart catalogViewEvents={catalogViewEvents}/>
                    <CatalogUserDevicesCardChart catalogViewEvents={catalogViewEvents}/>
                </>
            )}
        </>
    )
}