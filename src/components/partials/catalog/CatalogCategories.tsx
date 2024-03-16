import { Category } from "@/types/category"
import { Product } from "@/types/product"

interface Props {
    products: Product[]
    categories: Category[]
    onCategoryClick: (category: Category) => void
}

export const CatalogCategories = ({ categories, products, onCategoryClick }: Props) => {
    return (
        <div>
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