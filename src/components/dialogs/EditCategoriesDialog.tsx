import {ReactElement, useState} from "react";
import {
    Dialog, DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {z} from "zod";
import {useNotifications} from "@/hooks/use-notifications.tsx";
import {Category} from "@/types/category";
import {Badge} from "@/components/ui/badge.tsx";
import {Icons} from "@/components/ui/icons.tsx";

interface Props {
    children: ReactElement
    categories: Category[]
    onAddCategory: (category: Category) => Promise<void>
    onRemoveCategory: (category: Category) => Promise<void>
}

const formSchema = z.object({
    name: z.string()
        .min(1, 'O campo nome da categoria é obrigatório.'),
})

export const EditCategoriesDialog = ({children, categories, onAddCategory, onRemoveCategory}: Props) => {
    const {notifyError} = useNotifications()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [name, setName] = useState<string>('')

    const validate = () => {
        const result = formSchema.safeParse({name})
        if (!result.success) {
            notifyError(result.error.issues.map((issue) => issue.message))
        }
        if (categories.map((category) => category.name).includes(name)) {
            notifyError(`A categoria '${name}' já existe.`)
            return false
        }
        return result.success
    }

    const addCategory = async () => {
        if (!validate()) return
        setIsLoading(true)
        await onAddCategory({name})
        setName('')
        setIsLoading(false)
    }

    const removeCategory = async (category: Category) => {
        setIsLoading(true)
        await onRemoveCategory(category)
        setIsLoading(false)
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>
                        Categorias
                    </DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="flex flex-col space-y-4">
                        <div className="flex items-end space-x-2">
                            <div className="w-full">
                                <Label htmlFor="name">Nome da Categoria</Label>
                                <Input id="name" value={name} disabled={isLoading} autoFocus
                                       onChange={(e) => setName(e.currentTarget.value)}/>
                            </div>
                            <Button onClick={addCategory} disabled={isLoading}>
                                {isLoading && <Icons.loader className="mr-2 w-4 h-4 animate-spin" />}
                                Adicionar
                            </Button>
                        </div>

                        <Label className="pt-4">Categorias Existentes no Catálogo</Label>
                        <div className="flex flex-auto flex-wrap">
                            {categories.map((category) => (
                                <Badge key={category.id} className="flex w-fit mb-1 mr-1 items-center">
                                    <span className="mr-1 select-none">
                                        {category.name}
                                    </span>
                                    <Icons.x
                                        className="h-3 w-3 cursor-pointer"
                                        onClick={() => isLoading ? null : removeCategory(category)}
                                    />
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button disabled={isLoading}>
                            Fechar
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}