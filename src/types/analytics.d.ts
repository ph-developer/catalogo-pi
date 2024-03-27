export interface CatalogViewEvent {
    date: string
    clientIdentifier: string
    catalogId: string
    device: 'mobile'|'desktop'
}

export interface ProductViewEvent {
    date: string
    clientIdentifier: string
    catalogId: string
    productId: string
    device: 'mobile'|'desktop'
}

export type AnalyticsEvent = CatalogViewEvent|ProductViewEvent