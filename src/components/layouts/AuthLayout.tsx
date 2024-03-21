import {Link, Navigate, Outlet} from "react-router-dom"
import {Button} from "@/components/ui/button"
import {Icons} from "@/components/ui/icons"
import {Label} from "@/components/ui/label.tsx"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {useCatalogs} from "@/hooks/use-catalogs.ts";
import {useAuth} from "@/hooks/use-auth.ts";

const AuthLayout = () => {
    const {currentUser, doLogout} = useAuth()
    const {catalogs} = useCatalogs(currentUser?.catalogIds)

    if (!currentUser) return <Navigate to='/login'/>

    return (
        <>
            <header className='sticky top-0 z-50 py-2 border-b bg-white shadow-sm'>
                <div className="flex w-full items-center container">
                    <div className="flex items-center space-x-2 ml-2">
                        <Link className="mr-2" to='/dash'>
                            <Icons.logo className="stroke-indigo-500 w-6 h-6"/>
                        </Link>
                        <Button className="focus-visible:ring-0" variant="ghost" asChild>
                            <Link to="/dash">
                                Início
                            </Link>
                        </Button>
                        <Button className="focus-visible:ring-0" variant="ghost" asChild>
                            <Link className="cursor-pointer" to="/dash/catalogs">
                                Meus Catálogos
                            </Link>
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="focus-visible:ring-0" variant="ghost">
                                    Catálogos
                                    <Icons.chevronDown className="h-4 w-4 ml-2"/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                {catalogs.map((catalog) => (
                                    <DropdownMenuItem key={`manu_${catalog.id}`} asChild>
                                        <Link className="cursor-pointer" to={`/dash/catalogs/${catalog.id}`}>
                                            {catalog.name}
                                        </Link>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="ml-auto flex items-center space-x-2 mr-2">
                        <Label>
                            {currentUser?.email}
                        </Label>
                        <Button variant="ghost" onClick={doLogout}>
                            <Icons.logout className='h-4 w-4 mr-2'/>
                            Sair
                        </Button>
                    </div>
                </div>
            </header>
            <Outlet/>
        </>
    )
}

export default AuthLayout