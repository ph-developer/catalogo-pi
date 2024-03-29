import {Catalog} from "@/types/catalog";
import {useMemo, useState} from "react";
import {Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {Button} from "@/components/ui/button.tsx";
import {cn} from "@/lib/utils.ts";
import {CatalogViewEvent} from "@/types/analytics";
import {chartColors} from "@/components/partials/dashboard/dashboard/charts/chart-colors.ts";
import {filterEventsByKeys, filterEventsByPeriod} from "@/helpers/analytics-filters.ts";

interface Props {
    catalogViewEvents: CatalogViewEvent[]
    catalogs: Catalog[]
    className?: string
}

interface ChartData {
    catalogName: string
    desktop: number
    mobile: number
}

export const CatalogUserDevicesCardChart = ({catalogViewEvents, catalogs, className = ''}: Props) => {
    const [days, setDays] = useState<number>(7)

    const chartData = useMemo<ChartData[]>(() => {
        const data: { [catalogId: string]: ChartData } = {}

        let events = filterEventsByPeriod(catalogViewEvents, days)
        events = filterEventsByKeys(events, (event) => [
            event.catalogId, event.clientIdentifier, event.device
        ])
        catalogs.forEach((catalog) => {
            if (catalog.id) data[catalog.id] = {catalogName: catalog.name, desktop: 0, mobile: 0}
        })
        events.forEach((event) => {
            const catalogId = event.catalogId
            if (data[catalogId] && ['desktop', 'mobile'].includes(event.device)) {
                data[catalogId][event.device]++
            }
        })

        return Object.values(data)
    }, [catalogs, days, catalogViewEvents])

    return (
        <div className={cn('flex w-full lg:w-1/2 h-96 p-1', className)}>
            <div
                className="flex flex-col justify-center items-start w-full h-full bg-white border rounded-xl shadow-sm"
            >
                <div className="flex items-center justify-center w-full font-bold pb-2">
                    Dispositivos Utilizados
                </div>
                <div className="flex flex-wrap w-full justify-end px-4 pb-2">
                    {[1, 7, 15, 30].map((periodInDays) => (
                        <Button
                            key={`cat_views_period_${periodInDays}`}
                            className="ml-1 text-xs px-2 h-6"
                            variant={days === periodInDays ? 'default' : 'ghost'}
                            onClick={() => setDays(periodInDays)}
                        >
                            {periodInDays === 1 ? '24 horas' : `${periodInDays} dias`}
                        </Button>
                    ))}
                </div>
                <ResponsiveContainer className="pr-4" height={280}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="catalogName" className="text-xs"/>
                        <YAxis className="text-xs" allowDecimals={false}/>
                        <Tooltip labelClassName="text-xs" wrapperClassName="text-xs"/>
                        <Legend wrapperStyle={{fontSize: '0.75rem'}}/>
                        <Bar dataKey="mobile" fill={chartColors[0]} name="Mobile"/>
                        <Bar dataKey="desktop" fill={chartColors[1]} name="Desktop"/>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}