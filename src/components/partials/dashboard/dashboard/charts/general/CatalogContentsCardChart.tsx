import {Catalog} from "@/types/catalog";
import {useMemo} from "react";
import {Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {cn} from "@/lib/utils.ts";
import {chartColors} from "@/components/partials/dashboard/dashboard/charts/chart-colors.ts";

interface Props {
    catalogs: Catalog[]
    className?: string
}

interface ChartData {
    catalogName: string
    products: number
    categories: number
}

export const CatalogContentsCardChart = ({catalogs, className = ''}: Props) => {
    const chartData = useMemo<ChartData[]>(() => {
        return catalogs.map((catalog) => ({
            catalogName: catalog.name,
            products: catalog.productIds.length,
            categories: catalog.categoryIds.length
        }))
    }, [catalogs])

    return (
        <div className={cn('flex w-full lg:w-1/2 h-96 p-1', className)}>
            <div
                className="flex flex-col justify-center items-start w-full h-full bg-white border rounded-xl shadow-sm"
            >
                <div className="flex items-center justify-center w-full font-bold pb-2">
                    Conteúdo do Catálogo
                </div>
                <div className="flex flex-wrap w-full justify-end px-4 pb-2 h-8"/>
                <ResponsiveContainer className="pr-4" height={280}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="catalogName" className="text-xs"/>
                        <YAxis className="text-xs" allowDecimals={false}/>
                        <Tooltip labelClassName="text-xs" wrapperClassName="text-xs"/>
                        <Legend wrapperStyle={{fontSize: '0.75rem'}}/>
                        <Bar dataKey="products" fill={chartColors[0]} name="Produtos"/>
                        <Bar dataKey="categories" fill={chartColors[1]} name="Categorias"/>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}