import {useMemo, useState} from "react";
import {Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip} from "recharts";
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
    value: number
}

export const CatalogUserDevicesCardChart = ({catalogViewEvents, className = ''}: Props) => {
    const [days, setDays] = useState<number>(7)

    const chartData = useMemo<ChartData[]>(() => {
        const data: { [device: string]: ChartData } = {
            'desktop': {label: 'Desktop', value: 0},
            'mobile': {label: 'Mobile', value: 0}
        }

        let events = filterEventsByPeriod(catalogViewEvents, days)
        events = filterEventsByKeys(events, (event) => [
            event.clientIdentifier, event.device
        ])
        events.forEach((event) => {
            if (['desktop', 'mobile'].includes(event.device)) {
                data[event.device].value++
            }
        })

        return Object.values(data)
    }, [days, catalogViewEvents])

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
                    <PieChart>
                        <Tooltip labelClassName="text-xs" wrapperClassName="text-xs"/>
                        <Legend wrapperStyle={{fontSize: '0.75rem'}}/>
                        <Pie data={chartData} nameKey="label" dataKey="value" label cx="50%" cy="50%">
                            {chartData.map((_, i) => (
                                <Cell key={`chart_devices_${i}`} fill={chartColors[i]}/>
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}