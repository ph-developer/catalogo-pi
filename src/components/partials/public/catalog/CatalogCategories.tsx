import { Category } from "@/types/category"
import { Product } from "@/types/product"
import {Catalog} from "@/types/catalog";
import {useMemo} from "react";

interface Props {
    catalog: Catalog
    products: Product[]
    categories: Category[]
    onCategoryClick: (category: Category) => void
}

export const CatalogCategories = ({ catalog, categories, products, onCategoryClick }: Props) => {
    const categoriesDisplay = useMemo(() => {
        return categories.map((category: Category) => ({
            category,
            productsCount: products
                .filter((product: Product) => product.categoryIds.includes(category.id!))
                .length
        })).filter(({productsCount}) => productsCount > 0)
    }, [categories, products])

    return (
        <div style={catalog ? {
            color: catalog.style.bgTextColor,
        } : {}}>
            <p className="mb-1 text-sm font-medium">
                Categorias
            </p>
            {categoriesDisplay.map(({category, productsCount}) => (
                <p
                    key={category.id}
                    className="text-sm cursor-pointer"
                    onClick={() => onCategoryClick(category)}
                >
                    {category.name} ({productsCount})
                </p>
            ))}
        </div>
    )
}