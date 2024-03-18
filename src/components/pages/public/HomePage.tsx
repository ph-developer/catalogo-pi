import {useBgColor} from "@/hooks/use-bg-color.ts";
import {usePageTitle} from "@/hooks/use-page-title.ts";

const HomePage = () => {
    useBgColor()
    usePageTitle()

    return (
        <>
            Home Page
        </>
    )
}

export default HomePage