import {Link, useParams} from "react-router-dom"
import {CatalogCompanyInfo} from '@/components/partials/public/catalog/CatalogCompanyInfo.tsx'
import {useMemo} from "react"
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

const ProductPage = () => {
    const {catalogUrl, productId} = useParams()
    const {getImgSrcFn} = useStorage()
    const {catalog, isLoading: isLoadingCatalog} = useCatalog('url', catalogUrl)
    const {product, isLoading: isLoadingProduct} = useProduct(isLoadingCatalog ? null : productId)
    const {
        categories,
        isLoading: isLoadingCategories
    } = useCategories(isLoadingCatalog ? null : (catalog?.categoryIds || []))

    useBgColor(catalog?.style.bgColor)
    usePageTitle(catalog?.name)

    const isLoading = useMemo(() => {
        return isLoadingCatalog || isLoadingProduct || isLoadingCategories
    }, [isLoadingCatalog, isLoadingProduct, isLoadingCategories])

    if (isLoading) return <LoaderDimmer/>

    if (!catalog) return <CatalogNotFound/>

    if (!product) return <ProductNotFound/>

    return (
        <section>
            <div className="flex pt-6 container mx-auto">
                <div className="columns-xs min-w-64 max-w-72 p-2 space-y-6">
                    {!!catalog.style.banner && (
                        <Link to={`/${catalog.url}`}>
                            <CatalogCompanyBanner catalog={catalog}/>
                        </Link>
                    )}

                    <CatalogCompanyInfo catalog={catalog}/>
                </div>
                <div className="flex flex-col w-full pb-6">
                    <Card className="w-auto mx-2 mt-2" style={catalog ? {
                        backgroundColor: catalog.style.accentColor,
                        color: catalog.style.accentTextColor,
                        borderColor: colors.getDarkenColor(catalog.style.accentColor, 1.5),
                    } : {}}>
                        <CardContent className="flex flex-col p-6 space-y-6">
                            <CardTitle>{product.name}</CardTitle>
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
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}

export default ProductPage