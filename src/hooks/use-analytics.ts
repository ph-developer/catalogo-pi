import {useEffect, useState} from "react";
import {CatalogViewEvent, ProductViewEvent} from "@/types/analytics";
import {DataSnapshot, onChildAdded, onChildChanged, ref, onChildRemoved} from "firebase/database";
import {rtdb} from "@/lib/firebase.ts";
import {analyticsEventsParser} from "@/parsers/analytics-events-parser.ts";

interface CatalogViewEvents {
    [catalogId: string]: CatalogViewEvent[]
}

interface ProductViewEvents {
    [catalogId: string]: ProductViewEvent[]
}

export const useAnalytics = (catalogIds: string[] | string | null = null) => {
    const [catalogViewEvents, setCatalogViewEvents] = useState<CatalogViewEvents>({})
    const [productViewEvents, setProductViewEvents] = useState<ProductViewEvents>({})

    const updateEvents = (catalogId: string) => (data: DataSnapshot) => {
        switch (data.key) {
            case 'catalogView':
                setCatalogViewEvents((prevState) => ({
                   ...prevState,
                    [catalogId]: analyticsEventsParser.catalogViewFromRTDB(data)
                }))
                break
            case 'productView':
                setProductViewEvents((prevState) => ({
                   ...prevState,
                    [catalogId]: analyticsEventsParser.productViewFromRTDB(data)
                }))
                break
        }
    }

    useEffect(() => {
        const ids = (Array.isArray(catalogIds))
            ? catalogIds
            : (!catalogIds ? null : [catalogIds])
        if (!ids) {
            return
        } else if (!ids.length) {
            if (Object.keys(catalogViewEvents).length) setCatalogViewEvents({})
            if (Object.keys(productViewEvents).length) setProductViewEvents({})
        } else {
            const unsubscribes = ids.map((catalogId) => {
                const analyticsRef = ref(rtdb, `analytics/${catalogId}`)
                return [
                    onChildAdded(analyticsRef, updateEvents(catalogId)),
                    onChildChanged(analyticsRef, updateEvents(catalogId)),
                    onChildRemoved(analyticsRef, updateEvents(catalogId))
                ]
            })

            return () => unsubscribes
                .flatMap((unsubscribe) => unsubscribe)
                .forEach((unsubscribe) => unsubscribe())
        }
    }, [catalogIds])

    return {
        catalogViewEvents: Object.values(catalogViewEvents).flatMap((values) => values),
        productViewEvents: Object.values(productViewEvents).flatMap((values) => values)
    }
}