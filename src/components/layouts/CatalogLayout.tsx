import {Link, Outlet, useLoaderData} from "react-router-dom"
import {Button} from "@/components/ui/button"
import {Icons} from "@/components/ui/icons"
import {colors} from "@/lib/colors.ts";
import {Catalog} from "@/types/catalog";

const CatalogLayout = () => {
    const catalog = useLoaderData() as Catalog | null

    return (
        <>
            <header className='sticky top-0 z-50 py-2 border-b bg-white shadow-sm' style={catalog?.bannerDominantColor ? {
                backgroundColor: colors.getDarkenColor(catalog.bannerDominantColor, 2.5),
                color: colors.getTextColor(catalog.bannerDominantColor),
                borderBottomColor: colors.getDarkenColor(catalog.bannerDominantColor, 4)
            } : {}}>
                <div className="flex w-full items-center container">
                    <div className="flex items-center space-x-2 ml-2">
                        <Link to='/'>
                            <Icons.logo className="stroke-indigo-500 w-6 h-6"/>
                        </Link>
                    </div>
                    <div className="ml-auto flex items-center space-x-2 mr-2">
                        <Button variant="ghost" className='ml-auto' asChild style={catalog?.bannerDominantColor ? {
                            color: colors.getTextColor(catalog.bannerDominantColor),
                            backgroundColor: colors.getDarkenColor(catalog.bannerDominantColor, 2.5),
                        } : {}}>
                            <Link to='/login'>
                                <Icons.dash className='h-4 w-4 mr-2'/>
                                Dashboard
                            </Link>
                        </Button>
                    </div>
                </div>
            </header>
            <Outlet/>
        </>
    )
}

export default CatalogLayout