import {Catalog} from "@/types/catalog";
import {useMemo, useRef, useState} from "react";
import {useAnalytics} from "@/hooks/use-analytics.ts";
import {Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis} from "recharts";
import {Button} from "@/components/ui/button.tsx";
import {cn} from "@/lib/utils.ts";
import {useResizeScreen} from "@/hooks/use-resize-screen.ts";
import {CatalogViewEvent} from "@/types/analytics";

interface Props {
    catalogIds?: string[]
    catalogs: Catalog[]
    className?: string
}

interface ChartData {
    catalogName: string
    desktop: number
    mobile: number
}

const chartColors = [
    '#818cf8',
    '#34d399',
    '#fb7185',
    '#fbbf24',
    '#22d3ee',
    '#e879f9'
]

export const CatalogUserDevicesCardChart = ({catalogIds, catalogs, className = ''}: Props) => {
    const {catalogViewEvents, filterEventsByPeriod, filterEventsByKeys} = useAnalytics(catalogIds)
    const divRef = useRef<HTMLDivElement | null>(null)
    const [days, setDays] = useState<number>(7)
    const [chartWidth, setChartWidth] = useState<number>(0)

    const chartData = useMemo<ChartData[]>(() => {
        if (!catalogIds) return []

        const data: { [catalogId: string]: ChartData } = {}

        let events: CatalogViewEvent[] = filterEventsByPeriod(catalogViewEvents, days)
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
    }, [catalogIds, days, catalogViewEvents])

    useResizeScreen(() => {
        const divWidth = divRef.current?.clientWidth
        if (divWidth) setChartWidth(divWidth - 16)
    })

    return (
        <div className={cn('flex w-full lg:w-1/2 h-96 p-1', className)}>
            <div
                className="flex flex-col justify-center items-start w-full h-full bg-white border rounded-xl shadow-sm"
                ref={divRef}
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
                <BarChart width={chartWidth} height={280} data={chartData}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="catalogName" className="text-xs"/>
                    <YAxis className="text-xs" allowDecimals={false}/>
                    <Tooltip labelClassName="text-xs" wrapperClassName="text-xs"/>
                    <Legend wrapperStyle={{fontSize: '0.75rem'}}/>
                    <Bar dataKey="mobile" fill={chartColors[0]} name="Mobile"/>
                    <Bar dataKey="desktop" fill={chartColors[1]} name="Desktop"/>
                </BarChart>
            </div>
        </div>
    )
}