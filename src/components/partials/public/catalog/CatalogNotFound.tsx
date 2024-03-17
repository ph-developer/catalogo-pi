import Lottie from "lottie-react";
import notFoundJson from '@/assets/lottie/not-found.json'

export const CatalogNotFound = () => {
    return (
        <section className="flex bg-slate-50 content-center" style={{ height: 'calc(100vh - 53px)' }}>
            <div className="flex flex-col pb-32 container items-center w-fit h-fit">
                <Lottie
                    className="h-80"
                    animationData={notFoundJson}
                    loop={true}
                />
                <div className="font-medium">
                    Catálogo não encontrado...
                </div>
            </div>
        </section>
    )
}