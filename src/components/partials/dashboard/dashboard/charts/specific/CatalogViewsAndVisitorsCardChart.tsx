import {useMemo, useState} from "react";
import moment from "moment/moment";
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {Button} from "@/components/ui/button.tsx";
import {cn} from "@/lib/utils.ts";
import {CatalogViewEvent} from "@/types/analytics";
import {chartColors} from "@/components/partials/dashboard/dashboard/charts/chart-colors.ts";
import {filterEventsByKeys, filterEventsByPeriod} from "@/helpers/analytics-filters.ts";

interface Props {
    catalogViewEvents: CatalogViewEvent[]
    className?: string
}

interface ChartData {
    label: string
    views: number
    visitors: number
}

export const CatalogViewsAndVisitorsCardChart = ({catalogViewEvents, className = ''}: Props) => {
    const [days, setDays] = useState<number>(7)

    const chartData = useMemo(() => {
        const keyFormat = days === 1 ? 'DD/MM/YYYY HH' : 'DD/MM/YYYY'
        const period = days === 1 ? 24 : days
        const labelFormat = days === 1 ? 'HH[h]' : 'DD/MMM'
        const subtractType = days === 1 ? 'hours' : 'days'
        const data: { [label: string]: ChartData } = {}

        const events = filterEventsByPeriod(catalogViewEvents, days)
        const viewEvents = events
        const visitorEvents = filterEventsByKeys(events, (event) => [
            moment(new Date(event.date)).format(keyFormat), event.clientIdentifier
        ])

        for (let i = 0; i < period; i++) {
            const label = moment().subtract(i, subtractType).format(labelFormat)
            data[label] = {label, views: 0, visitors: 0}
        }
        viewEvents.forEach((event) => {
            const label = moment(new Date(event.date)).format(labelFormat)
            data[label].views++
        })
        visitorEvents.forEach((event) => {
            const label = moment(new Date(event.date)).format(labelFormat)
            data[label].visitors++
        })

        return Object.values(data).reverse()
    }, [days, catalogViewEvents])

    return (
        <div className={cn('flex w-full lg:w-1/2 h-96 p-1', className)}>
            <div
                className="flex flex-col justify-center items-start w-full h-full bg-white border rounded-xl shadow-sm"
            >
                <div className="flex items-center justify-center w-full font-bold pb-2">
                    Visualizações e Visitantes
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
                        <Line type="monotone" dataKey="views" name="Visualizações" stroke={chartColors[0]}/>
                        <Line type="monotone" dataKey="visitors" name="Visitantes" stroke={chartColors[1]}/>
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}