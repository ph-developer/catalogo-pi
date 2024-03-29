import {CatalogViewsCardChart} from "@/components/partials/dashboard/dashboard/charts/general/CatalogViewsCardChart.tsx";
import {CatalogVisitorsCardChart} from "@/components/partials/dashboard/dashboard/charts/general/CatalogVisitorsCardChart.tsx";
import {CatalogContentsCardChart} from "@/components/partials/dashboard/dashboard/charts/general/CatalogContentsCardChart.tsx";
import {
    CatalogUserDevicesCardChart
} from "@/components/partials/dashboard/dashboard/charts/general/CatalogUserDevicesCardChart.tsx";
import {Catalog} from "@/types/catalog";
import {useAnalytics} from "@/hooks/use-analytics.ts";

interface Props {
    catalogIds: string[]
    catalogs: Catalog[]
}

export const GeneralCharts = ({catalogIds, catalogs}: Props) => {
    const {catalogViewEvents} = useAnalytics(catalogIds)

    return (
        <>
            {!!catalogs.length && (
                <>
                    <CatalogViewsCardChart catalogViewEvents={catalogViewEvents} catalogs={catalogs}/>
                    <CatalogVisitorsCardChart catalogViewEvents={catalogViewEvents} catalogs={catalogs}/>
                    <CatalogContentsCardChart catalogs={catalogs}/>
                    <CatalogUserDevicesCardChart catalogViewEvents={catalogViewEvents} catalogs={catalogs}/>
                </>
            )}
        </>
    )
}