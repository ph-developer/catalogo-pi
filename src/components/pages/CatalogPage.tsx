import { useLoaderData } from "react-router-dom"
import { Catalog } from '@/types/catalog'
import { CatalogItem } from '@/components/partials/catalog/CatalogItem'
import { CatalogCategories } from '@/components/partials/catalog/CatalogCategories'
import { CatalogCompanyInfo } from '@/components/partials/catalog/CatalogCompanyInfo'
import { useMemo, useState } from "react"
import { Category } from "@/types/category"
import { CatalogNotFound } from "../partials/catalog/CatalogNotFound"
import { CatalogCategoryFilters } from "../partials/catalog/CatalogCategoryFilters"

const CatalogPage = () => {
    const catalog = useLoaderData() as Catalog | null
    const [categoryFilterIds, setCategoryFilterIds] = useState<string[]>([])

    const products = useMemo(() => catalog?.products || [], [catalog])
    const filteredProducts = useMemo(() => {
        if (!categoryFilterIds.length) return products
        return products.filter(
            (p) => p.categories.intersection(categoryFilterIds).length >= categoryFilterIds.length
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

    if (!catalog) return <CatalogNotFound />

    return (
        <section className="bg-slate-50" style={{ height: 'calc(100vh - 53px)' }}>
            <div className="flex pt-6 container mx-auto" >
                <div className="columns-xs min-w-64 p-2 space-y-6">
                    <CatalogCompanyInfo catalog={catalog} />

                    {!!categoryFilterIds.length && (
                        <CatalogCategoryFilters
                            categories={catalog.categories.filter(
                                (c) => categoryFilterIds.includes(c.id)
                            )}
                            onCategoryClick={removeCategoryFilter}
                        />
                    )}

                    <CatalogCategories
                        products={filteredProducts}
                        categories={catalog.categories}
                        onCategoryClick={addCategoryFilter}
                    />
                </div>
                <div className="flex flex-col w-full">
                    {filteredProducts.map((p) => (
                        <CatalogItem
                            key={p.id}
                            product={p}
                            categories={catalog.categories.filter(
                                (category) => p.categories.includes(category.id)
                            )}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default CatalogPage