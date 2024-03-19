import {Icons} from "@/components/ui/icons.tsx";

export const LoaderDimmer = () => {
    return (
        <div
            className="flex flex-col items-center justify-center absolute top-0 left-0 z-[60] bg-white/60 h-screen w-screen"
        >
            <Icons.loader className="animate-spin stroke-indigo-500 w-10 h-10"/>
            <div className="mt-2 text-sm font-semibold text-indigo-500">Carregando...</div>
        </div>
    )
}
