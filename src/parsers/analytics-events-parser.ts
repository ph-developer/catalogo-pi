import {DataSnapshot} from "firebase/database";
import {AnalyticsEvent, RTDBAnalyticsEvent} from "@/types/analytics";

export const analyticsEventsParser = {
    fromRTDB: (
        data: DataSnapshot
    ): AnalyticsEvent[] => Object.values<RTDBAnalyticsEvent>(data.val())
        .map((event) => ({
            clientIdentifier: event.clientIdentifier,
            date: new Date(event.date),
            catalogId: event.catalogId,
            device: event.device
        }))
}