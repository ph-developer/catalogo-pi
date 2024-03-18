import { Catalog } from "@/types/catalog"
import {LazyLoadImg} from "@/components/ui/lazy-load-img.tsx";
import {useStorage} from "@/hooks/use-storage.ts";

interface Props {
    catalog: Catalog
}

export const CatalogCompanyBanner = ({ catalog }: Props) => {
    const { getImgSrcFn } = useStorage()

    if (!catalog.banner) return (<></>)

    return (
        <div className="flex justify-center">
            <LazyLoadImg
                className="rounded-lg"
                imgSrc={getImgSrcFn('banner', catalog.banner)}
            />
        </div>
    )
}