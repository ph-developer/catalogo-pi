import {ReactElement, useMemo, useState} from "react";
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
import {useStorage} from "@/hooks/use-storage.ts";
import {ImgInput} from "@/components/ui/img-input.tsx";
import {ImgPreview} from "@/components/ui/img-preview.tsx";
import {Icons} from "@/components/ui/icons.tsx";
import {CatalogStyle} from "@/types/catalog-style";
import {Badge} from "@/components/ui/badge.tsx";
import {HexColorPicker} from "react-colorful";
import {Input} from "@/components/ui/input.tsx";
import {cn} from "@/lib/utils.ts";
import {useNotifications} from "@/hooks/use-notifications.tsx";

interface Props {
    children: ReactElement
    catalog: Catalog
    onSaveStyle: (old: Catalog, catalogStyle: CatalogStyle) => Promise<void>
}

type ColorSelector = 'bgColor'|'bgTextColor'|'accentColor'|'accentTextColor'

export const EditCatalogStyleDialog = ({children, catalog, onSaveStyle}: Props) => {
    const {getImgSrcFn} = useStorage()
    const {notifyError} = useNotifications()
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [banner, setBanner] = useState<string | null>(catalog.style.banner)
    const [bannerDominantColor, setBannerDominantColor] = useState<string | null>(catalog.style.bannerDominantColor)
    const [bgColor, setBgColor] = useState<string>(catalog.style.bgColor || '#f8fafc')
    const [bgTextColor, setBgTextColor] = useState<string>(catalog.style.bgTextColor || '#000')
    const [accentColor, setAccentColor] = useState<string>(catalog.style.accentColor || '#fff')
    const [accentTextColor, setAccentTextColor] = useState<string>(catalog.style.accentTextColor || '#000')
    const [colorSelector, setColorSelector] = useState<ColorSelector>('bgColor')
    const [currentSelectorColor, setCurrentSelectorColor] = useState<string>(bgColor)

    const reload = (open: boolean) => {
        if (open) {
            setBanner(catalog.style.banner)
            setBannerDominantColor(catalog.style.bannerDominantColor)
            setBgColor(catalog.style.bgColor || '#f8fafc')
            setBgTextColor(catalog.style.bgTextColor || '#000')
            setAccentColor(catalog.style.accentColor || '#fff')
            setAccentTextColor(catalog.style.accentTextColor || '#000')
            setColorSelector('bgColor')
            setCurrentSelectorColor(bgColor)
        }
        setIsOpen(open)
    }

    const saveStyle = async () => {
        setIsLoading(true)
        await onSaveStyle(catalog, {
            banner, bannerDominantColor, bgColor, bgTextColor, accentColor, accentTextColor
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

    const getColor = useMemo(() => {
        switch (colorSelector) {
            case "bgColor":
                return bgColor
            case "bgTextColor":
                return bgTextColor
            case "accentColor":
                return accentColor
            case "accentTextColor":
                return accentTextColor
        }
    }, [colorSelector, bgColor, bgTextColor, accentColor, accentTextColor])

    const setColor = () => {
        if (!currentSelectorColor || currentSelectorColor === '#') notifyError('A cor é obrigatória.')

        switch (colorSelector) {
            case 'bgColor':
                return setBgColor(currentSelectorColor)
            case 'bgTextColor':
                return setBgTextColor(currentSelectorColor)
            case 'accentColor':
                return setAccentColor(currentSelectorColor)
            case 'accentTextColor':
                return setAccentTextColor(currentSelectorColor)
        }
    }

    const rollbackColor = () => {
        setCurrentSelectorColor(getColor)
    }

    const changeColorSelector = (colorSelector: ColorSelector) => {
        setColorSelector(colorSelector)
        switch (colorSelector) {
            case "bgColor":
                return setCurrentSelectorColor(bgColor)
            case "bgTextColor":
                return setCurrentSelectorColor(bgTextColor)
            case "accentColor":
                return setCurrentSelectorColor(accentColor)
            case "accentTextColor":
                return setCurrentSelectorColor(accentTextColor)
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
                        Editar Estilos - {catalog.name}
                    </DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="flex flex-col space-y-4">
                        <div>
                            <Label htmlFor="banner">Banner</Label>
                            {!banner ? (
                                <ImgInput className="h-48" onSelectImage={onSelectImage} disabled={isLoading}/>
                            ): (
                                <ImgPreview
                                    imgSrc={banner.startsWith('blob:') ? banner : getImgSrcFn('banner', banner)}
                                    className="h-48"
                                    closeable={true}
                                    disabled={isLoading}
                                    onClose={onDeselectImage}
                                />
                            )}
                        </div>
                        <div>
                            <Label>Cores</Label>
                            <div className="flex space-x-2">
                                <div className="flex flex-col w-full space-y-2">
                                    <Badge
                                        className={cn("cursor-pointer", {'border-black': colorSelector === 'bgColor'})}
                                        onClick={() => isLoading ? null : changeColorSelector('bgColor')}
                                        variant="outline"
                                    >
                                        <div className="h-4 w-4 rounded mr-2 border border-black" style={{backgroundColor: bgColor}}/>
                                        Cor de Fundo
                                    </Badge>
                                    <Badge
                                        className={cn("cursor-pointer", {'border-black': colorSelector === 'bgTextColor'})}
                                        onClick={() => isLoading ? null : changeColorSelector('bgTextColor')}
                                        variant="outline"
                                    >
                                        <div className="h-4 w-4 rounded mr-2 border border-black" style={{backgroundColor: bgTextColor}}/>
                                        Cor do Texto
                                    </Badge>
                                    <Badge
                                        className={cn("cursor-pointer", {'border-black': colorSelector === 'accentColor'})}
                                        onClick={() => isLoading ? null : changeColorSelector('accentColor')}
                                        variant="outline"
                                    >
                                        <div className="h-4 w-4 rounded mr-2 border border-black" style={{backgroundColor: accentColor}}/>
                                        Cor de Fundo (Realçe)
                                    </Badge>
                                    <Badge
                                        className={cn("cursor-pointer", {'border-black': colorSelector === 'accentTextColor'})}
                                        onClick={() => isLoading ? null : changeColorSelector('accentTextColor')}
                                        variant="outline"
                                    >
                                        <div className="h-4 w-4 rounded mr-2 border border-black" style={{backgroundColor: accentTextColor}}/>
                                        Cor do Texto (Realçe)
                                    </Badge>
                                </div>
                                <div className="flex w-fit space-x-2">
                                    <div className="relative w-[200px]">
                                        {isLoading && (
                                            <div className="absolute top-0 left-0 w-full h-full z-10"/>
                                        )}
                                        <HexColorPicker
                                            color={currentSelectorColor}
                                            onChange={setCurrentSelectorColor}
                                        />
                                    </div>
                                    <div className="flex flex-col w-20 space-y-2">
                                        <div>
                                            <p className="text-xs font-semibold">Cor Atual</p>
                                            <div
                                                className="h-6 w-full rounded mr-2 border border-black"
                                                style={{backgroundColor: getColor}}
                                            />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold">Cor Nova</p>
                                            <div
                                                className="h-6 w-full rounded mr-2 border border-black"
                                                style={{backgroundColor: currentSelectorColor}}
                                            />
                                        </div>
                                        <Button className="text-xs p-0 h-6" onClick={setColor} disabled={isLoading}>
                                            Alterar
                                        </Button>
                                        <Button className="text-xs p-0 h-6" onClick={rollbackColor} disabled={isLoading}>
                                            Reverter
                                        </Button>
                                        <Input
                                            disabled={isLoading}
                                            value={currentSelectorColor}
                                            onChange={(e) => setCurrentSelectorColor(e.currentTarget.value)}
                                        />
                                    </div>
                                </div>
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
                    <Button className="bg-success hover:bg-success/90" onClick={saveStyle} disabled={isLoading}>
                        {isLoading && <Icons.loader className="mr-2 w-4 h-4 animate-spin" />}
                        Salvar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}