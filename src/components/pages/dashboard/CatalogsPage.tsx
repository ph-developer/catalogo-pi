import {Link, useLoaderData, useNavigate} from "react-router-dom";
import {Catalog} from "@/types/catalog";
import {Table, TableBody, TableHead, TableHeader, TableRow, TableCell} from "@/components/ui/table.tsx";
import {Icons} from "@/components/ui/icons.tsx";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog.tsx";
import {EditCatalogDialog} from "@/components/dialogs/EditCatalogDialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {catalogRepository} from "@/repositories/catalog-repository.ts";
import {useNotifications} from "@/hooks/use-notifications.tsx";
import {storageRepository} from "@/repositories/storage-repository.ts";
import {ImgDialog} from "@/components/dialogs/ImgDialog.tsx";
import {UrlQrCodeDialog} from "@/components/dialogs/UrlQrCodeDialog.tsx";
import {CatalogsTable} from "@/components/partials/dashboard/catalogs/CatalogsTable.tsx";

const CatalogsPage = () => {
    const catalogs = useLoaderData() as Catalog[]
    const navigate = useNavigate()
    const {notifySuccess} = useNotifications()

    const saveCatalog = async (old: Catalog | null, catalog: Catalog) => {
        await catalogRepository.upsertCatalog(old, catalog)
        notifySuccess('Catálogo ' + (old ? 'atualizado.' : 'criado.'))
        navigate(0) // TODO: remove refresh
    }

    const deleteCatalog = async (catalog: Catalog) => {
        if (catalog.id) {
            await catalogRepository.deleteCatalog(catalog.id)
            notifySuccess('Catálogo excluído.')
            navigate(0) // TODO: remove refresh
        }
    }

    return (
        <section>
            <div className="flex flex-col pt-6 container mx-auto">
                <div className="flex justify-end py-2">
                    <EditCatalogDialog onSaveCatalog={saveCatalog}>
                        <Button className="text-sm">
                            Novo Catálogo
                        </Button>
                    </EditCatalogDialog>
                </div>
                <div className="bg-white border rounded-xl shadow-sm">
                    <CatalogsTable
                        catalogs={catalogs}
                        onUpdateCatalog={saveCatalog}
                        onDeleteCatalog={deleteCatalog}
                    />
                </div>
            </div>
        </section>
    )
}

export default CatalogsPage