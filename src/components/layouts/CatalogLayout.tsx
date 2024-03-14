import { useState } from "react"
import { Link, Outlet } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { SelectLocationDialog } from "../dialogs/SelectLocationDialog"

const CatalogLayout = () => {
    const [city, setCity] = useState<string | null>(null)

    return (
        <>
            <header className='sticky top-0 z-50 py-2 border-b bg-white'>
                <div className="flex w-full items-center container">                    
                    <div className="flex items-center space-x-2 ml-2">        
                        <Link to='/'>
                            <Icons.logo className="stroke-indigo-500 w-6 h-6" />
                        </Link>
                    </div>
                    <div className="ml-auto flex items-center space-x-2 mr-2">
                        <SelectLocationDialog onChangeCity={setCity}>
                            <Button className="p-2" variant="ghost">
                                <Icons.mapPin className='h-4 w-4 mr-2' />
                                {city || 'Selecionar Cidade'}
                            </Button>
                        </SelectLocationDialog>
                        <Button variant="ghost" className='ml-auto' asChild>
                            <Link to='/login'>
                                <Icons.dash className='h-4 w-4 mr-2' />
                                Dashboard
                            </Link>
                        </Button>
                    </div>
                </div>
            </header>
            <Outlet />
        </>
    )
}

export default CatalogLayout