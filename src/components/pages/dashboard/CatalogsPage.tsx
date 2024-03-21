import {Catalog} from "@/types/catalog";
import {EditCatalogDialog} from "@/components/dialogs/EditCatalogDialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useNotifications} from "@/hooks/use-notifications.tsx";
import {CatalogsTable} from "@/components/partials/dashboard/catalogs/CatalogsTable.tsx";
import {useCatalogs} from "@/hooks/use-catalogs.ts";
import {useBgColor} from "@/hooks/use-bg-color.ts";
import {usePageTitle} from "@/hooks/use-page-title.ts";
import {useStorage} from "@/hooks/use-storage.ts";
import {useUser} from "@/hooks/use-user.ts";
import {useAuth} from "@/hooks/use-auth.ts";
import {useMemo} from "react";
import {LoaderDimmer} from "@/components/partials/LoaderDimmer.tsx";

const CatalogsPage = () => {
    useBgColor()
    usePageTitle('Meus Catálogos')

    const {currentUser} = useAuth()
    const {catalogs, isLoading: isLoadingCatalogs, insertCatalog, updateCatalog, deleteCatalog} = useCatalogs(currentUser?.catalogIds)
    const {uploadImg, deleteImg} = useStorage()
    const {addCatalogIdToUser, removeCatalogIdFromUser} = useUser()
    const {notifySuccess, notifyError} = useNotifications()

    const isLoading = useMemo(() => {
        return isLoadingCatalogs
    }, [isLoadingCatalogs])

    if (isLoading || !currentUser) return <LoaderDimmer/>

    const onSaveCatalog = async (old: Catalog | null, catalog: Catalog) => {
        const shouldReplaceBanner = old?.banner !== catalog.banner
        if (old && shouldReplaceBanner) {
            const banner = catalog.banner ? await uploadImg('banner', catalog.banner) : null
            await updateCatalog({...catalog, banner})
            if (old.banner) await deleteImg('banner', old.banner)
            notifySuccess('Catálogo atualizado.')
        } else if (old && !shouldReplaceBanner) {
            await updateCatalog(catalog)
            notifySuccess('Catálogo atualizado.')
        } else {
            const banner = catalog.banner ? await uploadImg('banner', catalog.banner) : null
            const catalogId = await insertCatalog({...catalog, banner})
            if (catalogId) {
                await addCatalogIdToUser(catalogId)
                notifySuccess('Catálogo criado.')
            } else {
                notifyError('Ocorreu um erro ao criar o catálogo.')
            }
        }
    }

    const onDeleteCatalog = async (catalog: Catalog) => {
        if (catalog.id) {
            const result = await deleteCatalog(catalog.id)
            if (result) {
                await removeCatalogIdFromUser(catalog.id)
                notifySuccess('Catálogo excluído.')
            } else {
                notifyError('Ocorreu um erro ao excluir o catálogo.')
            }
        }
    }

    return (
        <section>
            <div className="flex flex-col pt-6 container mx-auto">
                <div className="flex justify-end py-2">
                    <EditCatalogDialog onSaveCatalog={onSaveCatalog}>
                        <Button className="text-sm">
                            Novo Catálogo
                        </Button>
                    </EditCatalogDialog>
                </div>
                <div className="bg-white border rounded-xl shadow-sm">
                    <CatalogsTable
                        catalogs={catalogs}
                        onUpdateCatalog={onSaveCatalog}
                        onDeleteCatalog={onDeleteCatalog}
                    />
                </div>
            </div>
        </section>
    )
}

export default CatalogsPage