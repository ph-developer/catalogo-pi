import {useEffect, useState} from "react";
import {AnalyticsEvent} from "@/types/analytics";
import {DataSnapshot, onChildAdded, onChildChanged, ref, onChildRemoved} from "firebase/database";
import {rtdb} from "@/lib/firebase.ts";
import {analyticsEventsParser} from "@/parsers/analytics-events-parser.ts";

interface CatalogEvents {
    [catalogId: string]: AnalyticsEvent[]
}

export const useAnalytics = (catalogIds: string[] | null = null) => {
    const [catalogViewEvents, setCatalogViewEvents] = useState<CatalogEvents>({})

    const updateEvents = (catalogId: string) => (data: DataSnapshot) => {
        if (data.key === 'catalogView') {
            setCatalogViewEvents((prevState) => ({
                ...prevState,
                [catalogId]: analyticsEventsParser.fromRTDB(data)
            }))
        }
    }

    useEffect(() => {
        if (!catalogIds) {
            return
        } else if (!catalogIds.length && Object.keys(catalogViewEvents).length) {
            setCatalogViewEvents({})
        } else {
            const unsubscribes = catalogIds.map((catalogId) => {
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
        catalogViewEvents
    }
}