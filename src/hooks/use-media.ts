import {useState} from "react";
import {useMount} from "@/hooks/use-mount.tsx";

type Breakpoint = 'xs'|'sm'|'md'|'lg'|'xl'|'2xl'

export const useMedia = () => {
    const [breakpoint, setBreakpoint] = useState<Breakpoint>('xs')

    useMount(() => {
        const handleResize = () => {
            const screenWidth = window.innerWidth

            if (screenWidth >= 1536) {
                setBreakpoint('2xl')
            } else if (screenWidth >= 1280) {
                setBreakpoint('xl')
            } else if (screenWidth >= 1024) {
                setBreakpoint('lg')
            } else if (screenWidth >= 768) {
                setBreakpoint('md')
            } else if (screenWidth >= 640) {
                setBreakpoint('sm')
            } else {
                setBreakpoint('xs')
            }
        }

        window.addEventListener('resize', handleResize)
        handleResize()
        return () => window.removeEventListener('resize', handleResize)
    })

    return {
        breakpoint
    }
}