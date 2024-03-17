import {useLoaderData} from "react-router-dom"
import {Catalog} from '@/types/catalog'
import {CatalogItem} from '@/components/partials/catalog/CatalogItem'
import {CatalogCategories} from '@/components/partials/catalog/CatalogCategories'
import {CatalogCompanyInfo} from '@/components/partials/catalog/CatalogCompanyInfo'
import {useMemo, useState} from "react"
import {Category} from "@/types/category"
import {CatalogNotFound} from "@/components/partials/catalog/CatalogNotFound.tsx"
import {CatalogCategoryFilters} from "@/components/partials/catalog/CatalogCategoryFilters.tsx"
import {CatalogCompanyBanner} from "@/components/partials/catalog/CatalogCompanyBanner.tsx";

const CatalogPage = () => {
    const catalog = useLoaderData() as Catalog | null
    const [categoryFilterIds, setCategoryFilterIds] = useState<string[]>([])

    const products = useMemo(() => catalog?.products || [], [catalog])
    const filteredProducts = useMemo(() => {
        if (!categoryFilterIds.length) return products
        return products.filter(
            (p) => p.categoryIds.intersection(categoryFilterIds).length >= categoryFilterIds.length
        )
    }, [categoryFilterIds, products])

    const addCategoryFilter = (category: Category) => {
        if (!categoryFilterIds.includes(category.id)) {
            const ids = [...categoryFilterIds, category.id]
            setCategoryFilterIds(ids)
        }
    }

    const removeCategoryFilter = (category: Category) => {
        if (categoryFilterIds.includes(category.id)) {
            const ids = categoryFilterIds.filter((id) => id !== category.id)
            setCategoryFilterIds(ids)
        }
    }

    if (!catalog) return <CatalogNotFound/>

    return (
        <section>
            <div className="flex pt-6 container mx-auto">
                <div className="columns-xs min-w-64 max-w-72 p-2 space-y-6">
                    {!!catalog.banner && (
                        <CatalogCompanyBanner
                            catalog={catalog}
                        />
                    )}

                    <CatalogCompanyInfo catalog={catalog}/>

                    {!!categoryFilterIds.length && (
                        <CatalogCategoryFilters
                            catalog={catalog}
                            categories={catalog.categories?.filter(
                                (c) => categoryFilterIds.includes(c.id)
                            ) || []}
                            onCategoryClick={removeCategoryFilter}
                        />
                    )}

                    {!!catalog.categories?.length && (
                        <CatalogCategories
                            catalog={catalog}
                            products={filteredProducts}
                            categories={catalog.categories}
                            onCategoryClick={addCategoryFilter}
                        />
                    )}
                </div>
                <div className="flex flex-col w-full">
                    {filteredProducts.map((product) => (
                        <CatalogItem key={product.id} catalog={catalog} product={product}/>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default CatalogPage