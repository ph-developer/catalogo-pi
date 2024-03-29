import {Button} from "@/components/ui/button.tsx";
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {chartColors} from "@/components/partials/dashboard/dashboard/charts/chart-colors.ts";
import {useMemo} from "react";
import moment from "moment/moment";

export const ExampleChart = () => {
    const days = useMemo(() => 15, [])
    const chartData = useMemo(() => {
        const currentDate = moment()

        return [
            {label: currentDate.format('DD/MMM'), views: 2884, visitors: 2587},
            {label: currentDate.subtract(1, 'days').format('DD/MMM'), views: 2687, visitors: 2311},
            {label: currentDate.subtract(1, 'days').format('DD/MMM'), views: 2554, visitors: 2213},
            {label: currentDate.subtract(1, 'days').format('DD/MMM'), views: 2348, visitors: 1986},
            {label: currentDate.subtract(1, 'days').format('DD/MMM'), views: 2155, visitors: 1895},
            {label: currentDate.subtract(1, 'days').format('DD/MMM'), views: 2078, visitors: 1758},
            {label: currentDate.subtract(1, 'days').format('DD/MMM'), views: 1688, visitors: 1352},
            {label: currentDate.subtract(1, 'days').format('DD/MMM'), views: 1254, visitors: 988},
            {label: currentDate.subtract(1, 'days').format('DD/MMM'), views: 1058, visitors: 814},
            {label: currentDate.subtract(1, 'days').format('DD/MMM'), views: 784, visitors: 685},
            {label: currentDate.subtract(1, 'days').format('DD/MMM'), views: 687, visitors: 586},
            {label: currentDate.subtract(1, 'days').format('DD/MMM'), views: 375, visitors: 255},
            {label: currentDate.subtract(1, 'days').format('DD/MMM'), views: 354, visitors: 213},
            {label: currentDate.subtract(1, 'days').format('DD/MMM'), views: 132, visitors: 74},
            {label: currentDate.subtract(1, 'days').format('DD/MMM'), views: 11, visitors: 7},
        ].reverse();
    }, [])

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