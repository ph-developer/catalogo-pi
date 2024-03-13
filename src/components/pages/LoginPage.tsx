import { Icons } from "@/components/ui/icons"
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from "@/components/ui/button"
import { FormEventHandler, useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Link, useNavigate } from "react-router-dom"
import { useNotifications } from '@/hooks/use-notifications'

const LoginPage = () => {
    const navigate = useNavigate()
    const { notifyError } = useNotifications()
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const validate = () => {
        const errors = []
        if (!email) errors.push('O campo email é obrigatório.')
        if (!password) errors.push('O campo senha é obrigatório.')
        if (errors.length) {
            notifyError(errors)
            return false
        }
        return true
    }

    const doLogin: FormEventHandler = async (e) => {
        e.preventDefault()
        if (!validate()) return

        setIsLoading(true)
        try {
            await signInWithEmailAndPassword(auth, email, password)
            navigate('/painel')
        } catch (error) {
            notifyError('Credenciais inválidas.')
            setIsLoading(false)
        }
    }

    return (
        <div className="h-screen flex items-center justify-center">
            <div className="h-fit w-fit flex flex-col items-center">
                <Link to='/'>
                    <Icons.logo className="h-16 w-16 pb-4 stroke-indigo-500" />
                </Link>
                <form onSubmit={doLogin} className="flex flex-col space-y-4 w-80">
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.currentTarget.value)} disabled={isLoading} autoFocus />
                    </div>
                    <div>
                        <Label htmlFor="password">Senha</Label>
                        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.currentTarget.value)} disabled={isLoading} />
                    </div>
                    <div>
                        <Button type="submit" className="mt-2 w-full" disabled={isLoading}>
                            <Icons.login className='h-4 w-4 mr-2' />
                            Entrar
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default LoginPage