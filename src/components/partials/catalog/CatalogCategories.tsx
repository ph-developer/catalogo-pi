import { Category } from "@/types/category"
import { Product } from "@/types/product"
import {Catalog} from "@/types/catalog";
import {colors} from "@/lib/colors.ts";

interface Props {
    catalog: Catalog
    products: Product[]
    categories: Category[]
    onCategoryClick: (category: Category) => void
}

export const CatalogCategories = ({ catalog, categories, products, onCategoryClick }: Props) => {
    return (
        <div style={catalog?.bannerDominantColor ? {
            color: colors.getTextColor(catalog.bannerDominantColor),
        } : {}}>
            <p className="mb-1 text-sm font-medium">
                Categorias
            </p>
            {categories.map((category) => (
                <p
                    key={category.id}
                    className="text-sm cursor-pointer"
                    onClick={() => onCategoryClick(category)}
                >
                    {category.name} ({
                        products
                            .filter((p) => p.categoryIds.includes(category.id))
                            .length
                    })
                </p>
            ))}
        </div>
    )
}