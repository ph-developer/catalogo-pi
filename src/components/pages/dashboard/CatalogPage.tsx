import {useParams} from "react-router-dom";
import {useCatalog} from "@/hooks/use-catalog.ts";
import {CatalogNotFound} from "@/components/partials/public/catalog/CatalogNotFound.tsx";
import {useAuth} from "@/hooks/use-auth.ts";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {Icons} from "@/components/ui/icons.tsx";
import {ConfirmDeleteProductDialog} from "@/components/dialogs/ConfirmDeleteProductDialog.tsx";
import {usePageTitle} from "@/hooks/use-page-title.ts";
import {useBgColor} from "@/hooks/use-bg-color.ts";
import {EditProductDialog} from "@/components/dialogs/EditProductDialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Product} from "@/types/product";
import {useNotifications} from "@/hooks/use-notifications.tsx";
import {useProducts} from "@/hooks/use-products.ts";
import {useCategories} from "@/hooks/use-categories.ts";
import {useMemo} from "react";
import {EditCategoriesDialog} from "@/components/dialogs/EditCategoriesDialog.tsx";
import {Category} from "@/types/category";
import {mapProductCategories} from "@/mappers/map-product-categories.ts";
import {LoaderDimmer} from "@/components/partials/LoaderDimmer.tsx";

const CatalogPage = () => {
    const {catalogId} = useParams()
    const {currentUser} = useAuth()
    const {notifySuccess, notifyError} = useNotifications()
    const {
        catalog,
        isLoading: isLoadingCatalog,
        addProductIdToCatalog,
        removeProductIdFromCatalog,
        addCategoryIdToCatalog,
        removeCategoryIdFromCatalog
    } = useCatalog('id', catalogId)
    const {
        products,
        isLoading: isLoadingProducts,
        insertProduct,
        updateProduct,
        deleteProduct
    } = useProducts(catalog?.productIds)
    const {categories, isLoading: isLoadingCategories, insertCategory, deleteCategory} = useCategories(catalog?.categoryIds)

    usePageTitle(catalog?.name)
    useBgColor()

    const isLoading = useMemo(() => {
        return isLoadingCatalog || isLoadingProducts || isLoadingCategories
    }, [isLoadingCatalog, isLoadingProducts, isLoadingCategories])

    if (isLoading || !currentUser || !catalogId) return <LoaderDimmer/>

    if (!catalog || !currentUser.catalogIds.includes(catalogId)) return <CatalogNotFound/>

    const onSaveProduct = async (old: Product | null, product: Product) => {
        if (old) {
            await updateProduct(product)
            notifySuccess('Produto atualizado.')
        } else {
            const productId = await insertProduct(product)
            if (productId) {
                await addProductIdToCatalog(productId)
                notifySuccess('Produto criado.')
            } else {
                notifyError('Ocorreu um erro ao criar o produto.')
            }
        }
    }

    const onDeleteProduct = async (product: Product) => {
        if (product.id) {
            const result = await deleteProduct(product.id)
            if (result) {
                await removeProductIdFromCatalog(product.id)
                notifySuccess('Produto excluído.')
            } else {
                notifyError('Ocorreu um erro ao excluir o produto.')
            }
        }
    }

    const onAddCategory = async (category: Category) => {
        const categoryId = await insertCategory(category)
        if (categoryId) {
            await addCategoryIdToCatalog(categoryId)
            notifySuccess('Categoria criada.')
        } else {
            notifyError('Ocorreu um erro ao criar a categoria.')
        }
    }

    const onRemoveCategory = async (category: Category) => {
        if (category.id) {
            const result = await deleteCategory(category.id)
            if (result) {
                await removeCategoryIdFromCatalog(category.id)
                notifySuccess('Categoria excluída.')
            } else {
                notifyError('Ocorreu um erro ao excluir a categoria.')
            }
        }
    }

    return (
        <section>
            <div className="flex flex-col pt-6 container mx-auto">
                <div className="flex items-center">
                    <div className="font-semibold mr-auto">
                        Catálogo: <span className="font-normal">{catalog?.name}</span>
                    </div>
                    <div className="flex justify-end py-2 space-x-2">
                        <EditCategoriesDialog
                            categories={categories}
                            onAddCategory={onAddCategory}
                            onRemoveCategory={onRemoveCategory}
                        >
                            <Button className="text-sm">
                                Categorias
                            </Button>
                        </EditCategoriesDialog>
                        <EditProductDialog onSaveProduct={onSaveProduct} categories={categories}>
                            <Button className="text-sm">
                                Novo Produto
                            </Button>
                        </EditProductDialog>
                    </div>
                </div>
                <div className="bg-white border rounded-xl shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Produto</TableHead>
                                <TableHead className="text-center">Ações</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell className="text-justify">
                                        <div className="font-semibold">
                                            {product.name}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Descrição: </span>{product.description}
                                        </div>
                                        {!!product.categoryIds.length && (
                                            <div>
                                                <span className="font-semibold">Categorias: </span>
                                                {mapProductCategories(product, categories)
                                                    .sortBy('name')
                                                    .map((category) => category.name)
                                                    .join(', ')}
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        <div className="flex items-center justify-center space-x-1.5 align-middle">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <EditProductDialog
                                                            product={product}
                                                            onSaveProduct={onSaveProduct}
                                                            categories={categories}
                                                        >
                                                            <div>
                                                                <Icons.edit
                                                                    className="w-3.5 h-3.5 cursor-pointer stroke-success"
                                                                />
                                                            </div>
                                                        </EditProductDialog>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Editar</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <ConfirmDeleteProductDialog
                                                            product={product}
                                                            onDeleteProduct={onDeleteProduct}
                                                        >
                                                            <div>
                                                                <Icons.trash
                                                                    className="w-3.5 h-3.5 cursor-pointer stroke-destructive"
                                                                />
                                                            </div>
                                                        </ConfirmDeleteProductDialog>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Excluir</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </section>
    )
}

export default CatalogPage