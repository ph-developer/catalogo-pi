import {Link, useParams} from "react-router-dom"
import {CatalogCompanyInfo} from '@/components/partials/public/catalog/CatalogCompanyInfo.tsx'
import {useMemo, useState} from "react"
import {CatalogNotFound} from "@/components/partials/public/catalog/CatalogNotFound.tsx"
import {CatalogCompanyBanner} from "@/components/partials/public/catalog/CatalogCompanyBanner.tsx";
import {useCatalog} from "@/hooks/use-catalog.ts";
import {usePageTitle} from "@/hooks/use-page-title.ts";
import {useBgColor} from "@/hooks/use-bg-color.ts";
import {useCategories} from "@/hooks/use-categories.ts";
import {LoaderDimmer} from "@/components/partials/LoaderDimmer.tsx";
import {useProduct} from "@/hooks/use-product.ts";
import {Card, CardContent, CardTitle} from "@/components/ui/card.tsx";
import {colors} from "@/lib/colors.ts";
import {mapProductCategories} from "@/mappers/map-product-categories.ts";
import {Badge} from "@/components/ui/badge.tsx";
import {ProductNotFound} from "@/components/partials/public/catalog/ProductNotFound.tsx";
import {LazyLoadImg} from "@/components/ui/lazy-load-img.tsx";
import {useStorage} from "@/hooks/use-storage.ts";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Icons} from "@/components/ui/icons.tsx";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {makeWhatsappUrl} from "@/lib/whatsapp.ts";

const ProductPage = () => {
    const {catalogUrl, productId} = useParams()
    const {getImgSrcFn} = useStorage()
    const {catalog, isLoading: isLoadingCatalog} = useCatalog('url', catalogUrl)
    const {product, isLoading: isLoadingProduct} = useProduct(isLoadingCatalog ? null : productId)
    const {
        categories,
        isLoading: isLoadingCategories
    } = useCategories(isLoadingCatalog ? null : (catalog?.categoryIds || []))
    const [collapsed, setCollapsed] = useState<boolean>(true)

    useBgColor(catalog?.style.bgColor)
    usePageTitle(catalog?.name)

    const isLoading = useMemo(() => {
        return isLoadingCatalog || isLoadingProduct || isLoadingCategories
    }, [isLoadingCatalog, isLoadingProduct, isLoadingCategories])

    if (isLoading) return <LoaderDimmer/>

    if (!catalog) return <CatalogNotFound/>

    if (!product) return <ProductNotFound/>

    const toggleCollapsed = () => setCollapsed(!collapsed)

    const openWhatsapp = () => {
        const productUrl = `${window.location.origin}/${catalog.url}/${product.id}`
        const text = `Olá, tenho interesse em adquirir o produto "${product.name}". (${productUrl})`
        const url = makeWhatsappUrl(catalog.whatsapp, text)
        window.open(url)
    }

    return (
        <section>
            <div className="flex flex-wrap md:flex-nowrap pt-6 container mx-auto">
                <div
                    className="flex flex-col flex-wrap columns-xs w-full min-w-64 md:max-w-72 pb-2 md:p-2 space-y-2 md:space-y-6"
                >
                    {!!catalog.style.banner && (
                        <Link to={`/${catalog.url}`}>
                            <CatalogCompanyBanner catalog={catalog}/>
                        </Link>
                    )}

                    <Collapsible open={!collapsed} onOpenChange={toggleCollapsed} className="md:hidden">
                        <div className="flex w-full">
                            <Link to={`/${catalog.url}`} className="mr-auto">
                                <Button className="h-7 p-2 w-12" variant="outline" onClick={toggleCollapsed}>
                                    <Icons.chevronLeft className="w-3 h-3"/>
                                </Button>
                            </Link>
                            <CollapsibleTrigger asChild>
                                <Button className="h-7 p-2 w-12" variant="outline" onClick={toggleCollapsed}>
                                    <Icons.menu className="w-3 h-3"/>
                                </Button>
                            </CollapsibleTrigger>
                        </div>
                        <CollapsibleContent className="space-y-6 pt-4">
                            <CatalogCompanyInfo catalog={catalog}/>
                        </CollapsibleContent>
                    </Collapsible>

                    <div className="md:flex flex-col flex-wrap w-full space-y-6 hidden md:visible">
                        <CatalogCompanyInfo catalog={catalog}/>
                    </div>
                </div>
                <div className="flex flex-col w-full pb-6">
                    <Card className="w-auto md:mx-2 mt-2" style={catalog ? {
                        backgroundColor: catalog.style.accentColor,
                        color: catalog.style.accentTextColor,
                        borderColor: colors.getDarkenColor(catalog.style.accentColor, 1.5),
                    } : {}}>
                        <CardContent className="flex flex-col p-6 space-y-6">
                            <CardTitle className="flex">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                        <span>
                                            <Icons.whatsapp
                                                className="w-3.5 h-3.5 mr-2 cursor-pointer fill-[#25d366]"
                                                onClick={openWhatsapp}
                                            />
                                        </span>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Chamar no WhatsApp</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                {product.name}
                            </CardTitle>
                            {!!product.photos.length && (
                                <div className="flex flex-wrap">
                                    {product.photos.map((photoId) => (
                                        <div key={photoId} className="mr-2 mb-2">
                                            <LazyLoadImg
                                                imgSrc={getImgSrcFn('product', photoId)}
                                                className="h-44 w-40 rounded-xl object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                            <p className="text-sm text-justify whitespace-break-spaces">
                                {product.description}
                            </p>
                            <div className="flex flex-wrap">
                                {mapProductCategories(product, categories).sortBy('name').map((category) => (
                                    <Badge key={`${product.id}_${category.id}`} className="mb-1 mr-1 select-none">
                                        {category.name}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}

export default ProductPage