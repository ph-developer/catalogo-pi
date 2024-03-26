import {Catalog} from "@/types/catalog";
import {useMemo, useRef, useState} from "react";
import {Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis} from "recharts";
import {cn} from "@/lib/utils.ts";
import {useResizeScreen} from "@/hooks/use-resize-screen.ts";

interface Props {
    catalogs: Catalog[]
    className?: string
}

interface ChartData {
    [catalogId: string]: ChartDataObj
}

interface ChartDataObj {
    catalogName: string
    products: number
    categories: number
}

const chartColors = [
    '#818cf8',
    '#34d399'
]

export const CatalogContentsCardChart = ({catalogs, className = ''}: Props) => {
    const divRef = useRef<HTMLDivElement | null>(null)
    const [chartWidth, setChartWidth] = useState<number>(0)

    const chartData = useMemo(() => {
        const data = catalogs.reduce(
            (prev, catalog) => {
                if (!catalog.id) return prev
                return {
                    ...prev,
                    [catalog.id]: {
                        catalogName: catalog.name,
                        products: catalog.productIds.length,
                        categories: catalog.categoryIds.length
                    }
                }
            },
            {} as ChartData
        )

        return Object
            .keys(data)
            .map((catalogId) => ({...data[catalogId]}))
    }, [catalogs])

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
                    Conteúdo
                </div>
                <div className="flex flex-wrap w-full justify-end px-4 pb-2 h-8"/>
                <BarChart width={chartWidth} height={280} data={chartData}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="catalogName" className="text-xs"/>
                    <YAxis className="text-xs" allowDecimals={false}/>
                    <Tooltip labelClassName="text-xs" wrapperClassName="text-xs"/>
                    <Legend wrapperStyle={{fontSize: '0.75rem'}}/>
                    <Bar dataKey="products" fill={chartColors[0]} name="Produtos"/>
                    <Bar dataKey="categories" fill={chartColors[1]} name="Categorias"/>
                </BarChart>
            </div>
        </div>
    )
}