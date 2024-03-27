import {DataSnapshot} from "firebase/database";
import {CatalogViewEvent, ProductViewEvent} from "@/types/analytics";

export const analyticsEventsParser = {
    catalogViewFromRTDB: (
        data: DataSnapshot
    ): CatalogViewEvent[] => Object.values<CatalogViewEvent>(data.val()).map((event) => ({
        clientIdentifier: event.clientIdentifier,
        date: event.date,
        catalogId: event.catalogId,
        device: event.device
    })),
    productViewFromRTDB: (
        data: DataSnapshot
    ): ProductViewEvent[] => Object.values<ProductViewEvent>(data.val()).map((event) => ({
        clientIdentifier: event.clientIdentifier,
        date: event.date,
        catalogId: event.catalogId,
        productId: event.productId,
        device: event.device
    }))
}