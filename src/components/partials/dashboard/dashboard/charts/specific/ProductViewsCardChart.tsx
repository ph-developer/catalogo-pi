import {useMemo, useRef, useState} from "react";
import moment from "moment/moment";
import {useAnalytics} from "@/hooks/use-analytics.ts";
import {CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis} from "recharts";
import {Button} from "@/components/ui/button.tsx";
import {cn} from "@/lib/utils.ts";
import {useResizeScreen} from "@/hooks/use-resize-screen.ts";
import {ProductViewEvent} from "@/types/analytics";
import {chartColors} from "@/components/partials/dashboard/dashboard/charts/chart-colors.ts";
import {useProducts} from "@/hooks/use-products.ts";

interface Props {
    catalogId: string
    productIds?: string[]
    className?: string
}

interface ChartData {
    [catalogId: string]: number | string
    label: string
}

export const ProductViewsCardChart = ({catalogId, productIds = [], className = ''}: Props) => {
    const {productViewEvents, filterEventsByPeriod} = useAnalytics(catalogId)
    const {products} = useProducts(productIds)
    const divRef = useRef<HTMLDivElement | null>(null)
    const [days, setDays] = useState<number>(7)
    const [chartWidth, setChartWidth] = useState<number>(0)

    const chartData = useMemo(() => {
        if (!productIds) return []

        const period = days === 1 ? 24 : days
        const labelFormat = days === 1 ? 'HH[h]' : 'DD/MMM'
        const subtractType = days === 1 ? 'hours' : 'days'
        const data: { [label: string]: ChartData } = {}

        const events = filterEventsByPeriod(productViewEvents, days) as ProductViewEvent[]
        for (let i = 0; i < period; i++) {
            const label = moment().subtract(i, subtractType).format(labelFormat)
            data[label] = {label, ...Object.fromEntries(productIds.map(productId => [productId, 0]))}
        }
        events.forEach((event) => {
            const label = moment(new Date(event.date)).format(labelFormat)
            if (typeof data[label][event.productId] === 'number') (data[label][event.productId] as number)++
        })

        return Object.values(data).reverse()
    }, [productIds, days, productViewEvents])

    useResizeScreen(() => {
        const divWidth = divRef.current?.clientWidth
        if (divWidth) setChartWidth(divWidth - 16)
    })

    return (
        <div className={cn('flex w-full min-h-96 p-1', className)}>
            <div
                className="flex flex-col justify-center items-start w-full h-full bg-white border rounded-xl shadow-sm"
                ref={divRef}
            >
                <div className="flex items-center justify-center w-full font-bold pb-2">
                    Visualizações
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
                <LineChart width={chartWidth} height={280} data={chartData}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="label" className="text-xs"/>
                    <YAxis className="text-xs" allowDecimals={false}/>
                    <Tooltip labelClassName="text-xs" wrapperClassName="text-xs"/>
                    <Legend wrapperStyle={{fontSize: '0.75rem'}}/>
                    {productIds?.map((productId, i) => (
                        <Line
                            key={productId}
                            type="monotone"
                            dataKey={productId}
                            name={products.find((product) => product.id === productId)?.name ?? productId}
                            stroke={chartColors[i % chartColors.length]}
                        />
                    ))}
                </LineChart>
            </div>
        </div>
    )
}