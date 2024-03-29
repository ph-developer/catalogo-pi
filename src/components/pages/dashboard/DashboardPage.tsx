import {useBgColor} from "@/hooks/use-bg-color.ts";
import {usePageTitle} from "@/hooks/use-page-title.ts";
import {useAuth} from "@/hooks/use-auth.ts";
import {useEffect, useMemo, useState} from "react";
import {useCatalogs} from "@/hooks/use-catalogs.ts";
import {LoaderDimmer} from "@/components/partials/LoaderDimmer.tsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectSeparator,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select.tsx";
import {GeneralCharts} from "@/components/partials/dashboard/dashboard/GeneralCharts.tsx";
import {SpecificCharts} from "@/components/partials/dashboard/dashboard/SpecificCharts.tsx";

const DashboardPage = () => {
    useBgColor()
    usePageTitle('Dashboard')

    const {currentUser} = useAuth()
    const {catalogs, isLoading: isLoadingCatalogs} = useCatalogs(currentUser?.catalogIds)
    const [selectedCatalogId, setSelectedCatalogId] = useState<string>('general')

    const isLoading = useMemo(() => {
        return isLoadingCatalogs
    }, [isLoadingCatalogs])

    useEffect(() => {
        const catalogIds = currentUser?.catalogIds || []
        if (!catalogIds.length && selectedCatalogId) {
            setSelectedCatalogId('general')
        } else if (!selectedCatalogId) {
            setSelectedCatalogId('general')
        } else if (selectedCatalogId !== 'general' && !catalogIds.includes(selectedCatalogId)) {
            setSelectedCatalogId('general')
        }
    }, [selectedCatalogId, currentUser?.catalogIds])

    // const selectedCatalog = useMemo(() => {
    //     if (!selectedCatalogId || !catalogs.length) return null
    //     return catalogs.find((catalog) => catalog.id === selectedCatalogId) || null
    // }, [catalogs, selectedCatalogId])

    if (isLoading || !currentUser) return <LoaderDimmer/>

    return (
        <section>
            <div className="flex flex-col container mx-auto mb-2 pt-6">
                <div className="flex w-full justify-end px-1 pb-2">
                    <Select value={selectedCatalogId} onValueChange={setSelectedCatalogId}>
                        <SelectTrigger className="w-fit focus:ring-0">
                            <SelectValue/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="general">Geral</SelectItem>
                            <SelectSeparator/>
                            {catalogs?.map((catalog) => (
                                <SelectItem key={`select_${catalog.id}`} value={catalog.id || ''}>
                                    {catalog.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-wrap w-full">
                    {selectedCatalogId === 'general' && (
                        <GeneralCharts
                            catalogIds={currentUser.catalogIds}
                            catalogs={catalogs}
                        />
                    )}
                    {catalogs?.map((catalog) => {
                        if (catalog.id === selectedCatalogId) return (
                            <SpecificCharts
                                key={catalog.id}
                                catalog={catalog}
                            />
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export default DashboardPage