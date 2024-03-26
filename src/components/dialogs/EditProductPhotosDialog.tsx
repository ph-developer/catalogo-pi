import {ReactElement, useState} from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Product} from "@/types/product";
import {ImgPreview} from "@/components/ui/img-preview.tsx";
import {useStorage} from "@/hooks/use-storage.ts";
import {ImgInput} from "@/components/ui/img-input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {cn} from "@/lib/utils.ts";
import {Icons} from "@/components/ui/icons.tsx";

interface Props {
    product: Product,
    children: ReactElement,
    onSavePhotos: (old: Product, photoUrls: string[]) => Promise<void>
}

export const EditProductPhotosDialog = ({children, product, onSavePhotos}: Props) => {
    const [photoUrls, setPhotoUrls] = useState<string[]>([...product.photos])
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const {getImgSrcFn} = useStorage()

    const reload = (open: boolean) => {
        if (open) {
            setPhotoUrls([...product.photos])
        }
        setIsOpen(open)
    }

    const addPhotoUrl = (photoUrl: string) => {
        if (!photoUrl || photoUrls.includes(photoUrl)) return
        setPhotoUrls([...photoUrls, photoUrl])
    }

    const removePhotoUrl = (photoUrl: string) => () => {
        if (!photoUrl || !photoUrls.includes(photoUrl)) return
        setPhotoUrls(photoUrls.filter((url) => url !== photoUrl))
    }

    const savePhotos = async () => {
        setIsLoading(true)
        await onSavePhotos(product, photoUrls)
        setIsOpen(false)
        setIsLoading(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={reload}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[570px]">
                <DialogHeader>
                    Fotos ({product.name})
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className={cn(
                        "flex flex-wrap sm:max-h-[368px]",
                        {
                            'overflow-y-scroll': photoUrls.length >= 6
                        }
                    )}>
                        {photoUrls.map((photoUrl) => (
                            <div key={photoUrl} className="mr-2 mb-2">
                                <ImgPreview
                                    className="h-44 w-40 object-cover"
                                    imgSrc={photoUrl.startsWith('blob:') ? photoUrl : getImgSrcFn('product', photoUrl)}
                                    closeable={true}
                                    disabled={isLoading}
                                    onClose={removePhotoUrl(photoUrl)}
                                />
                            </div>
                        ))}
                        <ImgInput className="h-44 w-40" onSelectImage={addPhotoUrl} disabled={isLoading}/>
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button disabled={isLoading}>
                            Cancelar
                        </Button>
                    </DialogClose>
                    <Button className="bg-success hover:bg-success/90" onClick={savePhotos} disabled={isLoading}>
                        {isLoading && <Icons.loader className="mr-2 w-4 h-4 animate-spin" />}
                        Salvar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}