import {Navigate, Outlet} from "react-router-dom"
import {useAuth} from "@/hooks/use-auth.ts";

const GuestLayout = () => {
    const {currentUser} = useAuth()

    return !currentUser ? <Outlet/> : <Navigate to='/dash'/>
}

export default GuestLayout