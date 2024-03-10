import { useState } from "react"
import { Link, Outlet } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { SelectLocationDialog } from "../dialogs/SelectLocationDialog"

const CatalogLayout = () => {
    const [city, setCity] = useState<string | null>(null)

    return (
        <>
            <header className='sticky top-0 z-50 w-full p-2 flex items-center border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
                <div className="flex items-center space-x-2">
                    <SelectLocationDialog onChangeCity={setCity}>
                        <Button variant="ghost">
                            <Icons.mapPin className='h-4 w-4 mr-2' />
                            {city || 'Selecionar Cidade'}
                        </Button>
                    </SelectLocationDialog>
                </div>
                <div className="ml-auto flex items-center space-x-2">
                    <Button variant="ghost" className='ml-auto' asChild>
                        <Link to='/login'>
                            <Icons.login className='h-4 w-4 mr-2' />
                            Entrar
                        </Link>
                    </Button>
                </div>
            </header>
            <section className='p-2'>
                <Outlet />
            </section>
        </>
    )
}

export default CatalogLayout