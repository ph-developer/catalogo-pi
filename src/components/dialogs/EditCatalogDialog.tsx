import {ReactElement, useState} from "react";
import {Catalog} from "@/types/catalog";
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
import {withMask} from "use-mask-input";
import {z} from "zod";
import {useNotifications} from "@/hooks/use-notifications.tsx";
import {useStorage} from "@/hooks/use-storage.ts";
import {ImgInput} from "@/components/ui/img-input.tsx";
import {ImgPreview} from "@/components/ui/img-preview.tsx";
import {Icons} from "@/components/ui/icons.tsx";

interface Props {
    children: ReactElement
    catalog?: Catalog|null
    onSaveCatalog: (old: Catalog | null, catalog: Catalog) => Promise<void>
}

const formSchema = z.object({
    name: z.string()
        .min(1, 'O campo nome do catálogo é obrigatório.'),
    url: z.string()
        .min(1, 'O campo url do catálogo é obrigatório.')
        .regex(/^[a-zA-Z0-9_-]*$/, 'O campo url do catálogo possui caracteres inválidos.'),
    company: z.string()
        .min(1, 'O campo razão social é obrigatório.'),
    cnpj: z.string()
        .min(1, 'O campo cnpj é obrigatório.')
        .regex(/^[0-9]*$/, 'O campo cnpj possui caracteres inválidos.'),
    address: z.string()
        .min(1, 'O campo endereço é obrigatório.'),
    whatsapp: z.string()
        .min(1, 'O campo whatsapp é obrigatório.')
        .regex(/^[0-9]*$/, 'O campo whatsapp possui caracteres inválidos.'),
})

export const EditCatalogDialog = ({children, catalog = null, onSaveCatalog}: Props) => {
    const {notifyError} = useNotifications()
    const {getImgSrcFn} = useStorage()
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [name, setName] = useState<string>(catalog?.name || '')
    const [url, setUrl] = useState<string>(catalog?.url || '')
    const [company, setCompany] = useState<string>(catalog?.company || '')
    const [cnpj, setCnpj] = useState<string>(catalog?.cnpj || '')
    const [address, setAddress] = useState<string>(catalog?.address || '')
    const [whatsapp, setWhatsapp] = useState<string>(catalog?.whatsapp || '')
    const [banner, setBanner] = useState<string | null>(catalog?.banner || null)
    const [bannerDominantColor, setBannerDominantColor] = useState<string | null>(catalog?.bannerDominantColor || null)

    const reload = (open: boolean) => {
        if (open) {
            setName(catalog?.name || '')
            setUrl(catalog?.url || '')
            setCompany(catalog?.company || '')
            setCnpj(catalog?.cnpj || '')
            setAddress(catalog?.address || '')
            setWhatsapp(catalog?.whatsapp || '')
            setBanner(catalog?.banner || null)
            setBannerDominantColor(catalog?.bannerDominantColor || null)
        }
        setIsOpen(open)
    }

    const validate = () => {
        const result = formSchema.safeParse({
            name, url, company, cnpj, address, whatsapp
        })

        if (!result.success) {
            notifyError(result.error.issues.map((issue) => issue.message))
        }

        return result.success
    }

    const saveCatalog = async () => {
        if (!validate()) return
        setIsLoading(true)
        await onSaveCatalog(catalog, {
            name, url, company, cnpj, address, whatsapp, banner, bannerDominantColor,
            id: catalog?.id,
            categoryIds: catalog?.categoryIds || [],
            productIds: catalog?.productIds || [],
        })
        setIsOpen(false)
        setIsLoading(false)
    }

    const onSelectImage = (fileUrl: string, dominantColor: string|null) => {
        setBanner(fileUrl)
        setBannerDominantColor(dominantColor)
    }

    const onDeselectImage = () => {
        setBanner(null)
        setBannerDominantColor(null)
    }

    return (
        <Dialog open={isOpen} onOpenChange={reload}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>
                        {!catalog ? 'Novo' : 'Editar'} Catálogo
                    </DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="flex flex-col space-y-4">
                        <div>
                            <Label htmlFor="name">Nome do Catálogo</Label>
                            <Input id="name" value={name} disabled={isLoading} autoFocus
                                   onChange={(e) => setName(e.currentTarget.value)}/>
                        </div>
                        <div>
                            <Label htmlFor="url">URL do Catálogo</Label>
                            <Input id="url" value={url} disabled={isLoading}
                                   onChange={(e) => setUrl(e.currentTarget.value)}/>
                            <div className="text-xs text-muted-foreground">
                                Apenas letras, números, hífens e underlines são permitidos.
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="company">Razão Social</Label>
                            <Input id="company" value={company} disabled={isLoading}
                                   onChange={(e) => setCompany(e.currentTarget.value)}/>
                        </div>
                        <div>
                            <Label htmlFor="cnpj">CNPJ</Label>
                            <Input id="cnpj" value={cnpj} disabled={isLoading}
                                   ref={withMask('99.999.999/9999-99', {autoUnmask: true})}
                                   onChange={(e) => setCnpj(e.currentTarget.value)}/>
                        </div>
                        <div>
                            <Label htmlFor="address">Endereço</Label>
                            <Input id="address" value={address} disabled={isLoading}
                                   onChange={(e) => setAddress(e.currentTarget.value)}/>
                        </div>
                        <div>
                            <Label htmlFor="whatsapp">Whatsapp</Label>
                            <Input id="whatsapp" value={whatsapp} disabled={isLoading}
                                   ref={withMask(['+99 99 9999-9999', '+99 99 99999-9999'], {autoUnmask: true})}
                                   onChange={(e) => setWhatsapp(e.currentTarget.value)}/>
                        </div>
                        <div>
                            <Label htmlFor="banner">Banner</Label>
                            {!banner ? (
                                <ImgInput className="h-48" onSelectImage={onSelectImage}/>
                            ): (
                                <ImgPreview
                                    imgSrc={banner.startsWith('blob:') ? banner : getImgSrcFn('banner', banner)}
                                    className="h-48"
                                    closeable={true}
                                    onClose={onDeselectImage}
                                />
                            )}
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button disabled={isLoading}>
                            Cancelar
                        </Button>
                    </DialogClose>
                    <Button className="bg-success hover:bg-success/90" onClick={saveCatalog} disabled={isLoading}>
                        {isLoading && <Icons.loader className="mr-2 w-4 h-4 animate-spin" />}
                        Salvar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}