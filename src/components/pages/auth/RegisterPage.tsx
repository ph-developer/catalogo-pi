import { Icons } from "@/components/ui/icons.tsx"
import { Label } from '@/components/ui/label.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Button } from "@/components/ui/button.tsx"
import { FormEventHandler, useState } from "react"
import { Link } from "react-router-dom"
import { useNotifications } from '@/hooks/use-notifications.tsx'
import {z} from "zod";
import {useAuth} from "@/hooks/use-auth.ts";
import {useBgColor} from "@/hooks/use-bg-color.ts";
import {usePageTitle} from "@/hooks/use-page-title.ts";
import {FirebaseError} from '@firebase/util'

const formSchema = z.object({
    email: z.string()
        .min(1, 'O campo email é obrigatório.')
        .email('O campo email deve possuir um formato válido.'),
    password: z.string()
        .min(6, 'O campo senha é obrigatório e deve conter no mínimo 6 caracteres.'),
    confirmPassword: z.string()
        .min(6, 'O campo de confirmar senha é obrigatório e deve conter no mínimo 6 caracteres.')
})

const RegisterPage = () => {
    useBgColor()
    usePageTitle('Cadastro')

    const { notifyError } = useNotifications()
    const {doRegister} = useAuth()
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const validate = () => {
        const result = formSchema.safeParse({email, password, confirmPassword})

        if (!result.success) {
            notifyError(result.error.issues.map((issue) => issue.message))
        } else if (password !== confirmPassword) {
            notifyError('O campo senha e o campo confirmar senha devem ser iguais.')
            return false
        }

        return result.success
    }

    const onRegister: FormEventHandler = async (e) => {
        e.preventDefault()
        if (!validate()) return

        setIsLoading(true)
        try {
            await doRegister(email, password)
        } catch (error) {
            console.log(error)
            if (error instanceof FirebaseError) {
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        notifyError('Já existe uma conta com este e-mail.')
                        break
                    case 'auth/invalid-email':
                        notifyError('O e-mail deve possuir um formato válido.')
                        break
                    case 'auth/weak-password':
                        notifyError('A senha deve possuir no mínimo 6 caracteres.')
                        break
                    case 'auth/invalid-password':
                        notifyError('A senha deve possuir no mínimo 6 caracteres.')
                        break
                    default:
                        notifyError('Ocorreu um erro inesperado.')
                        break
                }
            } else {
                notifyError('Ocorreu um erro ao tentar cadastrar-se.')
            }
            setIsLoading(false)
        }
    }

    return (
        <div className="h-screen flex items-center justify-center">
            <div className="h-fit w-fit flex flex-col items-center">
                <Link to='/'>
                    <Icons.logo className="h-16 w-16 pb-4 stroke-indigo-500" />
                </Link>
                <form onSubmit={onRegister} className="flex flex-col space-y-4 w-80">
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.currentTarget.value)}
                               disabled={isLoading} autoFocus autoComplete="off"/>
                    </div>
                    <div>
                        <Label htmlFor="password">Senha</Label>
                        <Input id="password" type="password" value={password}
                               onChange={(e) => setPassword(e.currentTarget.value)} disabled={isLoading}/>
                    </div>
                    <div>
                        <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                        <Input id="confirmPassword" type="password" value={confirmPassword}
                               onChange={(e) => setConfirmPassword(e.currentTarget.value)} disabled={isLoading}/>
                    </div>
                    <div>
                        <Button type="submit" className="mt-2 w-full" disabled={isLoading}>
                            <Icons.login className='h-4 w-4 mr-2'/>
                            Cadastrar
                        </Button>
                    </div>
                    <div className="text-sm">
                        Já possui cadastro? <Link to="/login" className="hover:underline">Entre</Link>!
                    </div>
                </form>
            </div>
        </div>
    )
}

export default RegisterPage