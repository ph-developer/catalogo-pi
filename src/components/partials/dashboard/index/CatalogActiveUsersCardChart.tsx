import {Catalog} from "@/types/catalog";
import {useMemo, useRef, useState} from "react";
import moment from "moment/moment";
import {useAnalytics} from "@/hooks/use-analytics.ts";
import {CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis} from "recharts";
import {Button} from "@/components/ui/button.tsx";
import {cn} from "@/lib/utils.ts";
import {useResizeScreen} from "@/hooks/use-resize-screen.ts";

interface Props {
    catalogIds?: string[]
    catalogs: Catalog[]
    className?: string
}

interface ChartData {
    [date: string]: ChartDataObj
}

interface ChartDataObj {
    [catalogId: string]: string[]
}

const chartColors = [
    '#818cf8',
    '#34d399',
    '#fb7185',
    '#fbbf24',
    '#22d3ee',
    '#e879f9'
]

export const CatalogActiveUsersCardChart = ({catalogIds, catalogs, className = ''}: Props) => {
    const {catalogViewEvents} = useAnalytics(catalogIds)
    const divRef = useRef<HTMLDivElement | null>(null)
    const [days, setDays] = useState<number>(7)
    const [chartWidth, setChartWidth] = useState<number>(0)

    const chartData = useMemo(() => {
        if (!catalogIds) return []

        const empty = () => catalogIds.reduce(
            (prev, catalogId) => ({...prev, [catalogId]: []}),
            {} as ChartDataObj
        )

        const data: ChartData = {}
        const period = days === 1 ? 24 : days
        for (let i = 0; i < period; i++) {
            const dateString = days === 1
                ? moment().subtract(i, 'hours').format('DD-MM-YYYY-HH') + 'h'
                : moment().subtract(i, 'days').format('DD-MM-YYYY')
            data[dateString] = empty()
        }

        for (const [catalogId, events] of Object.entries(catalogViewEvents)) {
            for (const {date, clientIdentifier} of events) {
                const dateString = days === 1
                    ? moment(date).format('DD-MM-YYYY-HH') + 'h'
                    : moment(date).format('DD-MM-YYYY')
                if (data[dateString] && !data[dateString][catalogId].includes(clientIdentifier)) {
                    data[dateString][catalogId].push(clientIdentifier)
                }
            }
        }

        return Object
            .keys(data)
            .map((date) => {
                const entries = Object
                    .entries(data[date])
                    .map(([key, value]) => [key, value.length])
                return {date: date.substring(date.length-3), ...Object.fromEntries(entries)};
            })
            .reverse()
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
                    Usuários Ativos
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
                <LineChart width={chartWidth} height={275} data={chartData}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="date" className="text-xs"/>
                    <YAxis className="text-xs" allowDecimals={false}/>
                    <Tooltip labelClassName="text-xs" wrapperClassName="text-xs"/>
                    <Legend wrapperStyle={{fontSize: '0.75rem'}}/>
                    {catalogIds?.map((catalogId, i) => (
                        <Line
                            key={catalogId}
                            type="monotone"
                            dataKey={catalogId}
                            name={catalogs.find((catalog) => catalog.id === catalogId)?.name ?? catalogId}
                            stroke={chartColors[i % chartColors.length]}
                        />
                    ))}
                </LineChart>
            </div>
        </div>
    )
}