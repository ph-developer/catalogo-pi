import { useEffect, useState } from "react"
import { auth } from '@/lib/firebase'
import { Navigate, Outlet } from "react-router-dom"
import { onAuthStateChanged } from "firebase/auth"

const GuestLayout = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isAuth, setIsAuth] = useState<boolean>(false)

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            setIsAuth(!!user)
            setIsLoading(false)
        })
    }, [])

    if (isLoading) return <div />
    if (isAuth) return <Navigate to='/painel' />

    return <Outlet />
}

export default GuestLayout