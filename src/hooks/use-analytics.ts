import {useEffect, useState} from "react";
import {AnalyticsEvent, CatalogViewEvent, ProductViewEvent} from "@/types/analytics";
import {DataSnapshot, onChildAdded, onChildChanged, ref, onChildRemoved} from "firebase/database";
import {rtdb} from "@/lib/firebase.ts";
import {analyticsEventsParser} from "@/parsers/analytics-events-parser.ts";
import moment from "moment";

interface CatalogViewEvents {
    [catalogId: string]: CatalogViewEvent[]
}

interface ProductViewEvents {
    [catalogId: string]: ProductViewEvent[]
}

interface AnalyticsEvents {
    [catalogId: string]: AnalyticsEvent[]
}

export const useAnalytics = (catalogIds: string[] | null = null) => {
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
        if (!catalogIds) {
            return
        } else if (!catalogIds.length) {
            if (Object.keys(catalogViewEvents).length) setCatalogViewEvents({})
            if (Object.keys(productViewEvents).length) setProductViewEvents({})
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

    const filterEventsByPeriod = (events: AnalyticsEvents, days: number) => {
        let limitDate = moment().subtract(days, 'days').minutes(0).seconds(0).milliseconds(0)
        limitDate = (days > 1) ? limitDate.add(1, 'days').hours(0) : limitDate.add(1, 'hours')

        return Object.values(events)
            .flatMap((events) => events)
            .filter((event) => moment(new Date(event.date)).isAfter(limitDate))
    }

    const filterEventsByKeys = (events: AnalyticsEvent[], keysFn: (event: AnalyticsEvent) => string|string[]) => {
        const keys: string[] = []
        return events.reduce<AnalyticsEvent[]>((values, event) => {
            const keyResult = keysFn(event)
            const key = Array.isArray(keyResult) ? keyResult.join('|') : keyResult
            if (!keys.includes(key)) {
                keys.push(key)
                values.push(event)
            }
            return values
        }, [])
    }

    return {
        catalogViewEvents,
        productViewEvents,
        filterEventsByPeriod,
        filterEventsByKeys
    }
}