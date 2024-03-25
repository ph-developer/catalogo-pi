import {useBgColor} from "@/hooks/use-bg-color.ts";
import {usePageTitle} from "@/hooks/use-page-title.ts";
import {useAuth} from "@/hooks/use-auth.ts";
import {useMemo} from "react";
import {useCatalogs} from "@/hooks/use-catalogs.ts";
import {LoaderDimmer} from "@/components/partials/LoaderDimmer.tsx";
import {CatalogViewsCardChart} from "@/components/partials/dashboard/index/CatalogViewsCardChart.tsx";

const DashboardPage = () => {
    useBgColor()
    usePageTitle('Dashboard')

    const {currentUser} = useAuth()
    const {catalogs, isLoading: isLoadingCatalogs} = useCatalogs(currentUser?.catalogIds)

    const isLoading = useMemo(() => {
        return isLoadingCatalogs
    }, [isLoadingCatalogs])

    if (isLoading || !currentUser) return <LoaderDimmer/>

    return (
        <section>
            <div className="flex pt-6 container mx-auto">
                {!!catalogs.length && !!currentUser.catalogIds && (
                    <CatalogViewsCardChart
                        catalogIds={currentUser?.catalogIds}
                        catalogs={catalogs}
                    />
                )}
            </div>
        </section>
    )
}

export default DashboardPage