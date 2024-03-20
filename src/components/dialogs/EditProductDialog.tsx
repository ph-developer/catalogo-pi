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
import {Product} from "@/types/product";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Category} from "@/types/category";
import {Checkbox} from "@/components/ui/checkbox.tsx";

interface Props {
    children: ReactElement
    product?: Product | null
    categories?: Category[]
    onSaveProduct: (old: Product | null, product: Product) => void
}

const formSchema = z.object({
    name: z.string()
        .min(1, 'O campo nome do produto é obrigatório.'),
    description: z.string()
        .min(1, 'O campo descrição é obrigatório.'),
})

export const EditProductDialog = ({children, product = null, categories = [], onSaveProduct}: Props) => {
    const {notifyError} = useNotifications()
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [name, setName] = useState<string>(product?.name || '')
    const [description, setDescription] = useState<string>(product?.description || '')
    const [categoryIds, setCategoryIds] = useState<string[]>(product?.categoryIds || [])

    const reload = (open: boolean) => {
        if (open) {
            setName(product?.name || '')
            setDescription(product?.description || '')
            setCategoryIds(product?.categoryIds || [])
        }
        setIsOpen(open)
    }

    const validate = () => {
        const result = formSchema.safeParse({
            name, description
        })

        if (!result.success) {
            notifyError(result.error.issues.map((issue) => issue.message))
        }

        return result.success
    }

    const saveProduct = async () => {
        if (!validate()) return
        setIsLoading(true)
        onSaveProduct(product, {
            name, description, categoryIds,
            id: product?.id,
            photos: product?.photos || [],
        })
        setIsOpen(false)
        setIsLoading(false)
    }

    const handleCategoryCheck = (categoryId: string|null = null) => (checked: boolean) => {
        if (!categoryId) return
        if (checked) {
            setCategoryIds([...categoryIds, categoryId])
        } else {
            setCategoryIds(categoryIds.filter((id) => id !== categoryId))
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={reload}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>
                        {!product ? 'Novo' : 'Editar'} Produto
                    </DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="flex flex-col space-y-4">
                        <div>
                            <Label htmlFor="name">Nome do Produto</Label>
                            <Input id="name" value={name} disabled={isLoading} autoFocus
                                   onChange={(e) => setName(e.currentTarget.value)}/>
                        </div>
                        <div>
                            <Label htmlFor="description">Descrição</Label>
                            <Textarea id="description" className="resize-none" rows={3} value={description}
                                      disabled={isLoading}
                                      onChange={(e) => setDescription(e.currentTarget.value)}/>
                        </div>
                        <div>
                            <Label htmlFor="categories">Categorias</Label>
                            <div className="flex flex-wrap space-x-2 text-sm">
                                {categories.map((category) => (
                                    <div key={`check_${category.name}`} className="flex items-center flex-nowrap">
                                        <Checkbox
                                            className="mr-1.5"
                                            checked={categoryIds.includes(category.id!)}
                                            onCheckedChange={handleCategoryCheck(category.id)}
                                        />
                                        {category.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button disabled={isLoading}>
                            Cancelar
                        </Button>
                    </DialogClose>
                    <Button className="bg-success hover:bg-success/90" onClick={saveProduct} disabled={isLoading}>
                        Salvar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}