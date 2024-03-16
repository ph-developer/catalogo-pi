import {useEffect, useState} from "react"
import {Navigate, Outlet} from "react-router-dom"
import {authRepository} from "@/repositories/auth-repository.ts";

const GuestLayout = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isAuth, setIsAuth] = useState<boolean>(false)

    useEffect(() => {
        authRepository.onAuthStateChanged((user) => {
            setIsAuth(!!user)
            setIsLoading(false)
        })
    }, [])

    if (isLoading) return <div/>
    if (isAuth) return <Navigate to='/dash'/>

    return <Outlet/>
}

export default GuestLayout