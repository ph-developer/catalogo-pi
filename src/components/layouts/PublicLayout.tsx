import {Link, Outlet, useParams} from "react-router-dom"
import {Button} from "@/components/ui/button"
import {Icons} from "@/components/ui/icons"
import {colors} from "@/lib/colors.ts";
import {useCatalog} from "@/hooks/use-catalog.ts";
import {LoaderDimmer} from "@/components/partials/LoaderDimmer.tsx";
import {useMedia} from "@/hooks/use-media.ts";
import {cn} from "@/lib/utils.ts";

const PublicLayout = () => {
    const {catalogUrl} = useParams()
    const {catalog, isLoading} = useCatalog('url', catalogUrl)
    const {breakpoint} = useMedia()

    if (catalogUrl && isLoading) return <LoaderDimmer/>

    return (
        <>
            <header className='sticky top-0 z-50 py-2 border-b bg-white shadow-sm' style={catalog ? {
                backgroundColor: catalog.style.accentColor,
                color: catalog.style.accentTextColor,
                borderBottomColor: colors.getDarkenColor(catalog.style.accentColor, 1.5)
            } : {}}>
                <div className="flex w-full items-center container">
                    <div className="flex items-center space-x-2 ml-2">
                        <Link to='/'>
                            <Icons.logo className="stroke-indigo-500 w-6 h-6"/>
                        </Link>
                    </div>
                    <div className="ml-auto flex items-center space-x-2 mr-2">
                        <Button variant="ghost" className='ml-auto px-0 md:px-4' asChild style={catalog ? {
                            backgroundColor: catalog.style.accentColor,
                            color: catalog.style.accentTextColor,
                        } : {}}>
                            <Link to='/login'>
                                <Icons.dash className='h-4 w-4 md:mr-2'/>
                                <span className={cn({
                                    'hidden': ['xs', 'sm'].includes(breakpoint)
                                })}>Dashboard</span>
                            </Link>
                        </Button>
                    </div>
                </div>
            </header>
            <Outlet/>
        </>
    )
}

export default PublicLayout