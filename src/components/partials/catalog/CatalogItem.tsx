import { Product } from "@/types/product"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Badge } from '@/components/ui/badge'
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, CarouselApi } from '@/components/ui/carousel'
import { useMount } from '@/hooks/use-mount'
import { useEffect, useState } from "react"
import { LazyLoadImg } from '@/components/ui/lazy-load-img.tsx'
import {storageRepository} from "@/repositories/storage-repository.ts";

interface Props {
    product: Product
}

export const CatalogItem = ({ product }: Props) => {
    const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null)
    const [currentImg, setCurrentImg] = useState<number | null>(null)
    const [imgLoadedCount, setImgLoadedCount] = useState<number>(0)

    useMount(() => {
        setImgLoadedCount(0)
    })

    useEffect(() => {
        if (!carouselApi) return
        setCurrentImg(carouselApi.selectedScrollSnap())
        carouselApi.on('select', () => {
            setCurrentImg(carouselApi.selectedScrollSnap())
        })
    }, [carouselApi])

    const incImgLoadedCount = () => {
        setImgLoadedCount(imgLoadedCount + 1)
    }

    return (
        <Card className="w-auto mx-2 mt-2">
            <CardContent className="flex p-6 space-x-6">
                <div className="min-w-40 w-40">
                    <Carousel setApi={setCarouselApi}>
                        <CarouselContent>
                            {product.photos.map((photoId) => (
                                <CarouselItem key={photoId}>
                                    <LazyLoadImg
                                        imgSrc={() => storageRepository.getProductPhotoSrc(photoId)}
                                        onIsLoaded={incImgLoadedCount}
                                        className="h-44 w-40 rounded-xl object-cover"
                                    />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        {product.photos.length > 1 && imgLoadedCount === product.photos.length && (
                            <>
                                {currentImg !== 0 && (
                                    <CarouselPrevious className="left-1 w-4 h-4 opacity-50" />
                                )}
                                {currentImg !== product.photos.length - 1 && (
                                    <CarouselNext className="right-1 w-4 h-4 opacity-50" />
                                )}
                            </>
                        )}
                    </Carousel>
                </div>
                <div className="flex flex-col flex-auto space-y-6">
                    <CardTitle>{product.name}</CardTitle>
                    <CardDescription className="min-h-20 line-clamp-4 text-justify">
                        {product.description}
                    </CardDescription>
                    <div className="flex flex-wrap">
                        {product.categories?.map((category) => (
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