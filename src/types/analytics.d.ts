export interface AnalyticsEvent {
    date: Date
    clientIdentifier: string
    catalogId: string
}

export interface RTDBAnalyticsEvent {
    date: string
    clientIdentifier: string
    catalogId: string
}