export interface AnalyticsEvent {
    date: Date
    clientIdentifier: string
    catalogId: string
    device: 'mobile'|'desktop'
}

export interface RTDBAnalyticsEvent {
    date: string
    clientIdentifier: string
    catalogId: string
    device: 'mobile'|'desktop'
}