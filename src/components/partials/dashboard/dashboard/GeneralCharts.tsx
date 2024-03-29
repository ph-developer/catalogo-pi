import {CatalogViewsCardChart} from "@/components/partials/dashboard/dashboard/charts/general/CatalogViewsCardChart.tsx";
import {CatalogVisitorsCardChart} from "@/components/partials/dashboard/dashboard/charts/general/CatalogVisitorsCardChart.tsx";
import {CatalogContentsCardChart} from "@/components/partials/dashboard/dashboard/charts/general/CatalogContentsCardChart.tsx";
import {
    CatalogUserDevicesCardChart
} from "@/components/partials/dashboard/dashboard/charts/general/CatalogUserDevicesCardChart.tsx";
import {Catalog} from "@/types/catalog";

interface Props {
    catalogIds: string[]
    catalogs: Catalog[]
}

export const GeneralCharts = ({catalogIds, catalogs}: Props) => {
    return (
        <>
            {!!catalogs.length && (
                <>
                    <CatalogViewsCardChart catalogIds={catalogIds} catalogs={catalogs}/>
                    <CatalogVisitorsCardChart catalogIds={catalogIds} catalogs={catalogs}/>
                    <CatalogContentsCardChart catalogs={catalogs}/>
                    <CatalogUserDevicesCardChart catalogIds={catalogIds} catalogs={catalogs}/>
                </>
            )}
        </>
    )
}