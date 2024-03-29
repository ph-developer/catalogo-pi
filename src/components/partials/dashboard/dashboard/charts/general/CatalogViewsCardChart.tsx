import {Catalog} from "@/types/catalog";
import {useMemo, useState} from "react";
import moment from "moment/moment";
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {Button} from "@/components/ui/button.tsx";
import {cn} from "@/lib/utils.ts";
import {CatalogViewEvent} from "@/types/analytics";
import {chartColors} from "@/components/partials/dashboard/dashboard/charts/chart-colors.ts";
import {filterEventsByPeriod} from "@/helpers/analytics-filters.ts";

interface Props {
    catalogViewEvents: CatalogViewEvent[]
    catalogs: Catalog[]
    className?: string
}

interface ChartData {
    [catalogId: string]: number | string
    label: string
}

export const CatalogViewsCardChart = ({catalogViewEvents, catalogs, className = ''}: Props) => {
    const [days, setDays] = useState<number>(7)

    const chartData = useMemo<ChartData[]>(() => {
        const period = days === 1 ? 24 : days
        const labelFormat = days === 1 ? 'HH[h]' : 'DD/MMM'
        const subtractType = days === 1 ? 'hours' : 'days'
        const data: { [label: string]: ChartData } = {}

        const events = filterEventsByPeriod(catalogViewEvents, days)
        for (let i = 0; i < period; i++) {
            const label = moment().subtract(i, subtractType).format(labelFormat)
            data[label] = {label, ...Object.fromEntries(catalogs.map(catalog => [catalog.id, 0]))}
        }
        events.forEach((event) => {
            const label = moment(new Date(event.date)).format(labelFormat)
            if (typeof data[label][event.catalogId] === 'number') (data[label][event.catalogId] as number)++
        })

        return Object.values(data).reverse()
    }, [catalogs, days, catalogViewEvents])

    return (
        <div className={cn('flex w-full lg:w-1/2 h-96 p-1', className)}>
            <div
                className="flex flex-col justify-center items-start w-full h-full bg-white border rounded-xl shadow-sm"
            >
                <div className="flex items-center justify-center w-full font-bold pb-2">
                    Visualizações por Catálogo
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
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="label" className="text-xs"/>
                        <YAxis className="text-xs" allowDecimals={false}/>
                        <Tooltip labelClassName="text-xs" wrapperClassName="text-xs"/>
                        <Legend wrapperStyle={{fontSize: '0.75rem'}}/>
                        {catalogs?.map((catalog, i) => (
                            <Line
                                key={catalog.id}
                                type="monotone"
                                dataKey={catalog.id}
                                name={catalog.name}
                                stroke={chartColors[i % chartColors.length]}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}