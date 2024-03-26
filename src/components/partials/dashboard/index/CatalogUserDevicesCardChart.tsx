import {Catalog} from "@/types/catalog";
import {useMemo, useRef, useState} from "react";
import moment from "moment/moment";
import {useAnalytics} from "@/hooks/use-analytics.ts";
import {Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis} from "recharts";
import {Button} from "@/components/ui/button.tsx";
import {cn} from "@/lib/utils.ts";
import {useResizeScreen} from "@/hooks/use-resize-screen.ts";

interface Props {
    catalogIds?: string[]
    catalogs: Catalog[]
    className?: string
}

interface ChartData {
    [catalogId: string]: ChartDataObj
}

interface ChartDataObj {
    catalogName: string
    desktop: number
    mobile: number
}

interface ChartDataDevices {
    [clientIdentifier: string]: 'desktop'|'mobile'
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
    const {catalogViewEvents} = useAnalytics(catalogIds)
    const divRef = useRef<HTMLDivElement | null>(null)
    const [days, setDays] = useState<number>(7)
    const [chartWidth, setChartWidth] = useState<number>(0)

    const chartData = useMemo(() => {
        if (!catalogIds) return []

        const data: ChartData = catalogs.reduce(
            (prev, catalog) => {
                if (!catalog.id) return prev
                return ({...prev, [catalog.id]: {catalogName: catalog.name, desktop: 0, mobile: 0}});
            },
            {} as ChartData
        )

        const allowedDates: string[] = []
        const period = days === 1 ? 24 : days
        for (let i = 0; i < period; i++) {
            const dateString = days === 1
                ? moment().subtract(i, 'hours').format('DD-MM-YYYY-HH')
                : moment().subtract(i, 'days').format('DD-MM-YYYY')
            if (!allowedDates.includes(dateString)) allowedDates.push(dateString)
        }

        for (const [catalogId, events] of Object.entries(catalogViewEvents)) {
            const devices: ChartDataDevices = {}

            for (const {date, clientIdentifier, device} of events) {
                const dateString = days === 1
                    ? moment(date).format('DD-MM-YYYY-HH')
                    : moment(date).format('DD-MM-YYYY')
                if (allowedDates.includes(dateString) && !Object.keys(devices).includes(clientIdentifier)) {
                    devices[clientIdentifier] = device
                }
            }

            Object.values(devices).forEach((device) => {
                if (data[catalogId] && ['desktop', 'mobile'].includes(device)) {
                    data[catalogId][device]++
                }
            })
        }

        return Object
            .keys(data)
            .map((catalogId) => ({...data[catalogId]}))
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