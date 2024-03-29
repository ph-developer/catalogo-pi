import {useParams} from "react-router-dom"
import {CatalogItem} from '@/components/partials/public/catalog/CatalogItem.tsx'
import {CatalogCategories} from '@/components/partials/public/catalog/CatalogCategories.tsx'
import {CatalogCompanyInfo} from '@/components/partials/public/catalog/CatalogCompanyInfo.tsx'
import {useMemo, useState} from "react"
import {Category} from "@/types/category"
import {CatalogNotFound} from "@/components/partials/public/catalog/CatalogNotFound.tsx"
import {CatalogCategoryFilters} from "@/components/partials/public/catalog/CatalogCategoryFilters.tsx"
import {CatalogCompanyBanner} from "@/components/partials/public/catalog/CatalogCompanyBanner.tsx";
import {useCatalog} from "@/hooks/use-catalog.ts";
import {usePageTitle} from "@/hooks/use-page-title.ts";
import {useBgColor} from "@/hooks/use-bg-color.ts";
import {useProducts} from "@/hooks/use-products.ts";
import {useCategories} from "@/hooks/use-categories.ts";
import {LoaderDimmer} from "@/components/partials/LoaderDimmer.tsx";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Icons} from "@/components/ui/icons.tsx";

const CatalogPage = () => {
    const {catalogUrl} = useParams()
    const {catalog, isLoading: isLoadingCatalog} = useCatalog('url', catalogUrl)
    const {products, isLoading: isLoadingProducts} = useProducts(isLoadingCatalog ? null : (catalog?.productIds || []))
    const {
        categories,
        isLoading: isLoadingCategories
    } = useCategories(isLoadingCatalog ? null : (catalog?.categoryIds || []))
    const [categoryFilterIds, setCategoryFilterIds] = useState<string[]>([])
    const [collapsed, setCollapsed] = useState<boolean>(true)

    useBgColor(catalog?.style.bgColor)
    usePageTitle(catalog?.name)

    const isLoading = useMemo(() => {
        return isLoadingCatalog || isLoadingProducts || isLoadingCategories
    }, [isLoadingCatalog, isLoadingProducts, isLoadingCategories])

    const categoryFilters = useMemo(() => {
        return categories?.filter(
            (category) => categoryFilterIds.includes(category.id!)
        ) || []
    }, [categories, categoryFilterIds])

    const filteredProducts = useMemo(() => {
        if (!categoryFilterIds.length) return products
        return products.filter(
            (p) => p.categoryIds.intersection(categoryFilterIds).length >= categoryFilterIds.length
        )
    }, [categoryFilterIds, products])

    if (isLoading) return <LoaderDimmer/>

    if (!catalog) return <CatalogNotFound/>

    const addCategoryFilter = (category: Category) => {
        if (!categoryFilterIds.includes(category.id!)) {
            const ids = [...categoryFilterIds, category.id!]
            setCategoryFilterIds(ids)
        }
    }

    const removeCategoryFilter = (category: Category) => {
        if (categoryFilterIds.includes(category.id!)) {
            const ids = categoryFilterIds.filter((id) => id !== category.id)
            setCategoryFilterIds(ids)
        }
    }

    const toggleCollapsed = () => setCollapsed(!collapsed)

    return (
        <section>
            <div className="flex flex-wrap md:flex-nowrap pt-6 container mx-auto">
                <div
                    className="flex flex-col flex-wrap columns-xs w-full min-w-64 md:max-w-72 pb-2 md:p-2 space-y-2 md:space-y-6"
                >
                    {!!catalog.style.banner && (
                        <CatalogCompanyBanner catalog={catalog}/>
                    )}

                    <Collapsible open={!collapsed} onOpenChange={toggleCollapsed} className="md:hidden">
                        <div className="flex justify-end w-full">
                            <CollapsibleTrigger asChild>
                                <Button className="h-7 p-2 w-12" variant="outline" onClick={toggleCollapsed}>
                                    <Icons.menu className="w-3 h-3"/>
                                </Button>
                            </CollapsibleTrigger>
                        </div>
                        <CollapsibleContent className="space-y-6">
                            <CatalogCompanyInfo catalog={catalog}/>

                            {!!categoryFilterIds.length && (
                                <CatalogCategoryFilters
                                    catalog={catalog}
                                    categories={categoryFilters}
                                    onCategoryClick={removeCategoryFilter}
                                />
                            )}

                            {!!categories?.length && (
                                <CatalogCategories
                                    catalog={catalog}
                                    products={filteredProducts}
                                    categories={categories}
                                    onCategoryClick={addCategoryFilter}
                                />
                            )}
                        </CollapsibleContent>
                    </Collapsible>

                    <div className="md:flex flex-col flex-wrap w-full space-y-6 hidden md:visible">
                        <CatalogCompanyInfo catalog={catalog}/>

                        {!!categoryFilterIds.length && (
                            <CatalogCategoryFilters
                                catalog={catalog}
                                categories={categoryFilters}
                                onCategoryClick={removeCategoryFilter}
                            />
                        )}

                        {!!categories?.length && (
                            <CatalogCategories
                                catalog={catalog}
                                products={filteredProducts}
                                categories={categories}
                                onCategoryClick={addCategoryFilter}
                            />
                        )}
                    </div>
                </div>
                <div className="flex flex-col w-full pb-6">
                    {filteredProducts.map((product) => (
                        <CatalogItem
                            key={product.id}
                            catalog={catalog}
                            product={product}
                            categories={categories}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default CatalogPage