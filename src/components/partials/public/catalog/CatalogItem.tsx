import { Product } from "@/types/product"
import { Card, CardContent, CardTitle } from "@/components/ui/card.tsx"
import { Badge } from '@/components/ui/badge.tsx'
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, CarouselApi } from '@/components/ui/carousel.tsx'
import { useEffect, useState } from "react"
import { LazyLoadImg } from '@/components/ui/lazy-load-img.tsx'
import {colors} from "@/lib/colors.ts";
import {Catalog} from "@/types/catalog";
import {useStorage} from "@/hooks/use-storage.ts";
import {mapProductCategories} from "@/mappers/map-product-categories.ts";
import {Category} from "@/types/category";
import {Link} from "react-router-dom";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {Icons} from "@/components/ui/icons.tsx";
import {makeWhatsappUrl} from "@/lib/whatsapp.ts";

interface Props {
    catalog: Catalog
    categories: Category[]
    product: Product
}

export const CatalogItem = ({ catalog, categories, product }: Props) => {
    const {getImgSrcFn} = useStorage()
    const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null)
    const [currentImg, setCurrentImg] = useState<number | null>(null)

    useEffect(() => {
        if (!carouselApi) return
        setCurrentImg(carouselApi.selectedScrollSnap())
        carouselApi.on('select', () => {
            setCurrentImg(carouselApi.selectedScrollSnap())
        })
    }, [carouselApi])

    const openWhatsapp = () => {
        const productUrl = `${window.location.origin}/${catalog.url}/${product.id}`
        const text = `Olá, tenho interesse em adquirir o produto "${product.name}". (${productUrl})`
        const url = makeWhatsappUrl(catalog.whatsapp, text)
        window.open(url)
    }

    return (
        <Card className="w-auto md:mx-2 mt-2" style={catalog ? {
            backgroundColor: catalog.style.accentColor,
            color: catalog.style.accentTextColor,
            borderColor: colors.getDarkenColor(catalog.style.accentColor, 1.5),
        } : {}}>
            <CardContent className="flex flex-wrap justify-center md:flex-nowrap p-6 space-x-6">
                <div className="min-w-40 w-40 mb-6 md:mb-0">
                    <Carousel setApi={setCarouselApi}>
                        <CarouselContent>
                            {product.photos.map((photoId) => (
                                <CarouselItem key={photoId}>
                                    <LazyLoadImg
                                        imgSrc={getImgSrcFn('product', photoId)}
                                        className="h-44 w-40 rounded-xl object-cover"
                                    />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        {product.photos.length > 1 && (
                            <>
                                {currentImg !== 0 && (
                                    <CarouselPrevious className="left-1 w-4 h-4 opacity-50 text-black" />
                                )}
                                {currentImg !== product.photos.length - 1 && (
                                    <CarouselNext className="right-1 w-4 h-4 opacity-50 text-black" />
                                )}
                            </>
                        )}
                    </Carousel>
                </div>
                <div className="flex flex-col flex-auto space-y-6">
                    <CardTitle>
                        <div className="flex items-center">
                            <Link className="hover:underline pr-2 line-clamp-1 mr-auto md:mr-0" to={`/${catalog.url}/${product.id}`}>
                                {product.name}
                            </Link>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span>
                                            <Icons.whatsapp
                                                className="w-3.5 h-3.5 cursor-pointer fill-[#25d366]"
                                                onClick={openWhatsapp}
                                            />
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Chamar no WhatsApp</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </CardTitle>
                    <p className="text-sm min-h-20 line-clamp-4 text-justify whitespace-break-spaces">
                        {product.description}
                    </p>
                    <div className="flex flex-wrap">
                        {mapProductCategories(product, categories).sortBy('name').map((category) => (
                            <Badge key={`${product.id}_${category.id}`} className="mb-1 mr-1 select-none">
                                {category.name}
                            </Badge>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}