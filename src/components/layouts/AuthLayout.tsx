import { useEffect, useState } from "react"
import { auth } from '@/lib/firebase'
import { Link, Navigate, Outlet } from "react-router-dom"
import { User, onAuthStateChanged, signOut } from "firebase/auth"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { Label } from "../ui/label"

const AuthLayout = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [currentUser, setCurrentUser] = useState<User | null>(null)

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            setCurrentUser(user)
            setIsLoading(false)
        })
    }, [])

    const doLogout = async () => {
        await signOut(auth)
    }

    if (isLoading) return <div />
    if (!currentUser) return <Navigate to='/login' />

    return (
        <>
            <header className='sticky top-0 z-50 w-full py-2 px-3 flex items-center border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
                <div className="flex items-center space-x-2">
                    <Link to='/painel'>
                        <Icons.logo className="stroke-indigo-500 w-6 h-6" />
                    </Link>
                </div>
                <div className="ml-auto flex items-center space-x-2">
                    <Label>
                        {currentUser?.email}
                    </Label>
                    <Button variant="ghost" onClick={doLogout}>
                        <Icons.logout className='h-4 w-4 mr-2' />
                        Sair
                    </Button>
                </div>
            </header>
            <section className='p-2'>
                <Outlet />
            </section>
        </>
    )
}

export default AuthLayout