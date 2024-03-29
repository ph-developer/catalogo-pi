import moment from "moment/moment";
import {AnalyticsEvent} from "@/types/analytics";

export const filterEventsByPeriod = <T extends AnalyticsEvent>(events: T[], days: number): T[] => {
    let limitDate = moment().subtract(days, 'days').minutes(0).seconds(0).milliseconds(0)
    limitDate = (days > 1) ? limitDate.add(1, 'days').hours(0) : limitDate.add(1, 'hours')

    return events.filter((event) => moment(new Date(event.date)).isAfter(limitDate))
}

export const filterEventsByKeys = <T extends AnalyticsEvent>(events: T[], keysFn: (event: T) => string | string[]): T[] => {
    const keys: string[] = []
    return events.reduce<T[]>((values, event) => {
        const keyResult = keysFn(event)
        const key = Array.isArray(keyResult) ? keyResult.join('|') : keyResult
        if (!keys.includes(key)) {
            keys.push(key)
            values.push(event)
        }
        return values
    }, [])
}