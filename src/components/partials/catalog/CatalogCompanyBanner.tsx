import { Catalog } from "@/types/catalog"
import {LazyLoadImg} from "@/components/ui/lazy-load-img.tsx";
import {storageRepository} from "@/repositories/storage-repository.ts";

interface Props {
    catalog: Catalog
}

export const CatalogCompanyBanner = ({ catalog }: Props) => {
    if (!catalog.banner) return (<></>)

    return (
        <div className="flex justify-center">
            <LazyLoadImg
                className="rounded-lg"
                imgSrc={() => storageRepository.getBannerPhotoSrc(catalog.banner!)}
            />
        </div>
    )
}