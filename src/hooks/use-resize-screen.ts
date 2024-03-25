import {useMount} from "@/hooks/use-mount.tsx";

export const useResizeScreen = (onResize: () => void) => {
    useMount(() => {
        onResize()
        window.addEventListener('resize', onResize)
        return () => {
            window.removeEventListener('resize', onResize)
        }
    })
}