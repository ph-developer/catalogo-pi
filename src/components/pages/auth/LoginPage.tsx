import { Icons } from "@/components/ui/icons.tsx"
import { Label } from '@/components/ui/label.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Button } from "@/components/ui/button.tsx"
import { FormEventHandler, useState } from "react"
import { Link } from "react-router-dom"
import { useNotifications } from '@/hooks/use-notifications.tsx'
import {z} from "zod";
import {useAuth} from "@/hooks/use-auth.ts";

const formSchema = z.object({
    email: z.string()
        .min(1, 'O campo email é obrigatório.')
        .email('O campo email deve possuir um formato válido.'),
    password: z.string()
        .min(1, 'O campo senha é obrigatório.')
})

const LoginPage = () => {
    const { notifyError } = useNotifications()
    const {doLogin} = useAuth()
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const validate = () => {
        const result = formSchema.safeParse({email, password})

        if (!result.success) {
            notifyError(result.error.issues.map((issue) => issue.message))
        }

        return result.success
    }

    const onLogin: FormEventHandler = async (e) => {
        e.preventDefault()
        if (!validate()) return

        setIsLoading(true)
        try {
            await doLogin(email, password)
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
                <form onSubmit={onLogin} className="flex flex-col space-y-4 w-80">
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