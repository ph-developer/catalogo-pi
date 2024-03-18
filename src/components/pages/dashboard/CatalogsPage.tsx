import {Catalog} from "@/types/catalog";
import {EditCatalogDialog} from "@/components/dialogs/EditCatalogDialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useNotifications} from "@/hooks/use-notifications.tsx";
import {CatalogsTable} from "@/components/partials/dashboard/catalogs/CatalogsTable.tsx";
import {useCatalogs} from "@/hooks/use-catalogs.ts";

const CatalogsPage = () => {
    const {catalogs, insertCatalog, updateCatalog, deleteCatalog} = useCatalogs()
    const {notifySuccess} = useNotifications()

    const onSaveCatalog = async (old: Catalog | null, catalog: Catalog) => {
        if (old) {
            await updateCatalog(old, catalog)
            notifySuccess('Catálogo atualizado.')
        }        else {
            await insertCatalog(catalog)
            notifySuccess('Catálogo criado.')
        }
    }

    const onDeleteCatalog = async (catalog: Catalog) => {
        if (catalog.id) {
            await deleteCatalog(catalog.id)
            notifySuccess('Catálogo excluído.')
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