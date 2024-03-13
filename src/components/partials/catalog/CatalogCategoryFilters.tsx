import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/ui/icons"
import { Category } from "@/types/category"

interface Props {
    categories: Category[]
    onCategoryClick: (category: Category) => void
}

export const CatalogCategoryFilters = ({ categories, onCategoryClick }: Props) => {
    return (
        <div>
            <p className="mb-1 text-sm font-medium">
                Filtros
            </p>
            <div className="flex flex-auto flex-wrap">
                {categories.map((category) => (
                    <Badge key={category.id} className="flex w-fit mb-1 mr-1 items-center">
                        <span className="mr-1 select-none">
                            {category.name}
                        </span>
                        <Icons.x
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => onCategoryClick(category)}
                        />
                    </Badge>
                ))}
            </div>
        </div>
    )
}