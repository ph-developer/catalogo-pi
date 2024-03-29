import {cn} from "@/lib/utils.ts";
import {chartColors} from "@/components/partials/dashboard/dashboard/charts/chart-colors.ts";

interface Props {
    label: string
    value: number
    colorIndex?: number
    className?: string
}

export const CatalogTextDisplay = ({label, value, className = '', colorIndex = 0}: Props) => {
    return (
        <div className={cn('flex w-full md:w-1/2 lg:w-1/4 h-[6.5rem] p-1', className)}>
            <div className="flex flex-col justify-center items-start w-full h-full bg-white border rounded-xl shadow-sm">
                <div className="flex items-center justify-center w-full font-bold pb-2">
                    {label}
                </div>
                <div
                    className="flex flex-wrap w-full justify-center font-semibold px-4 pb-2"
                    style={{color: chartColors[colorIndex]}}
                >
                    {value}
                </div>
            </div>
        </div>
    )
}