import {useBgColor} from "@/hooks/use-bg-color.ts";
import {usePageTitle} from "@/hooks/use-page-title.ts";

const DashboardPage = () => {
    useBgColor()
    usePageTitle('Dashboard')

    return (
        <section>
            <div className="flex pt-6 container mx-auto" >
                <div className="p-2">
                    Dashboard
                </div>
            </div>
        </section>
    )
}

export default DashboardPage