import {Button} from "@/components/ui/button.tsx";
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {chartColors} from "@/components/partials/dashboard/dashboard/charts/chart-colors.ts";
import {useMemo} from "react";

export const ExampleChart = () => {
    const days = useMemo(() => 7, [])
    const chartData = useMemo(() => [
        {label: 'Jan', views: 11, visitors: 7},
        {label: 'Fev', views: 132, visitors: 74},
        {label: 'Mar', views: 354, visitors: 213},
        {label: 'Abr', views: 375, visitors: 255},
        {label: 'Mai', views: 687, visitors: 586},
        {label: 'Jun', views: 784, visitors: 685},
        {label: 'Jul', views: 1058, visitors: 814},
        {label: 'Ago', views: 1254, visitors: 988},
        {label: 'Set', views: 1688, visitors: 1352},
        {label: 'Out', views: 2078, visitors: 1758},
        {label: 'Nov', views: 2155, visitors: 1895},
        {label: 'Dez', views: 2348, visitors: 1986},
    ], [])

    return (
        <div className='flex w-full h-full p-1'>
            <div
                className="flex flex-col justify-center items-start w-full h-full bg-white border rounded-xl shadow-md py-2"
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
                        >
                            {periodInDays === 1 ? '24 horas' : `${periodInDays} dias`}
                        </Button>
                    ))}
                </div>
                <ResponsiveContainer className="pr-4">
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