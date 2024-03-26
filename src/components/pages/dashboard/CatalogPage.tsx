import {Link, useParams} from "react-router-dom";
import {useCatalog} from "@/hooks/use-catalog.ts";
import {CatalogNotFound} from "@/components/partials/public/catalog/CatalogNotFound.tsx";
import {useAuth} from "@/hooks/use-auth.ts";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {Icons} from "@/components/ui/icons.tsx";
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
import {LoaderDimmer} from "@/components/partials/LoaderDimmer.tsx";
import {UrlQrCodeDialog} from "@/components/dialogs/UrlQrCodeDialog.tsx";
import {useStorage} from "@/hooks/use-storage.ts";
import {ProductsTable} from "@/components/partials/dashboard/catalog/ProductsTable.tsx";

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
    } = useProducts(isLoadingCatalog ? null : catalog?.productIds || [])
    const {
        categories,
        isLoading: isLoadingCategories,
        insertCategory,
        deleteCategory
    } = useCategories(isLoadingCatalog ? null : catalog?.categoryIds || [])
    const {uploadImg, deleteImg} = useStorage()

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

    const onSavePhotos = async (old: Product, photoUrls: string[]) => {
        const diffPhotoUrls = photoUrls.symDiff(old.photos)
        if (!diffPhotoUrls.length) return

        const photos = [...old.photos]
        for (const photoUrl of diffPhotoUrls) {
            if (photoUrl.startsWith('blob:')) {
                const url = await uploadImg('product', photoUrl)
                if (url) photos.push(url)
            } else {
                await deleteImg('product', photoUrl)
                photos.splice(photos.indexOf(photoUrl), 1)
            }
        }

        const result = await updateProduct({...old, photos})
        if (result) {
            notifySuccess('Fotos atualizadas.')
        } else {
            notifyError('Ocorreu um erro ao atualizar as fotos.')
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
                    <div className="font-semibold mr-2">
                        {catalog?.name}
                    </div>
                    <div className="flex space-x-2 items-center mr-auto">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link to={`/${catalog.url}`} target="_blank">
                                        <Icons.open className="w-3.5 h-3.5 mt-0.5 cursor-pointer stroke-primary"/>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Abrir "{catalog.url}"</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="mt-1">
                                        <UrlQrCodeDialog url={catalog.url}>
                                            <Icons.qrCode
                                                className="w-3.5 h-3.5 cursor-pointer stroke-primary"
                                            />
                                        </UrlQrCodeDialog>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>QR Code</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
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
                {!!products.length ? (
                    <div className="bg-white border rounded-xl shadow-sm">
                        <ProductsTable
                            products={products}
                            categories={categories}
                            onSaveProduct={onSaveProduct}
                            onDeleteProduct={onDeleteProduct}
                            onSavePhotos={onSavePhotos}
                        />
                    </div>
                ) : (
                    <div className="text-sm">Não há nenhum produto cadastrado...</div>
                )}
            </div>
        </section>
    )
}

export default CatalogPage