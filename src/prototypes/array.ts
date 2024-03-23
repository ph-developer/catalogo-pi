// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare interface Array<T> {
    intersection(arr: T[]): T[]
    diff(arr: T[]): T[]
    symDiff(arr: T[]): T[]
    sortBy<T extends object>(this: T[], property: keyof T): T[]
}

Array.prototype.intersection = function <T>(this: T[], arr: T[]): T[] {
    return this.filter((x) => arr.includes(x))
}

Array.prototype.diff = function <T>(this: T[], arr: T[]): T[] {
    return this.filter((x) => !arr.includes(x))
}

Array.prototype.symDiff = function <T>(this: T[], arr: T[]): T[] {
    return this.filter((x) => !arr.includes(x))
        .concat(arr.filter((x) => !this.includes(x)))
}

Array.prototype.sortBy = function <T extends object>(this: T[], property: keyof T): T[] {
    return this.sort((a, b) => {
        if (typeof a !== "object" || typeof b !== "object") return 0
        if (a === null || b === null) return 0
        if (!Object.prototype.hasOwnProperty.call(a, property)) return 0
        if (!Object.prototype.hasOwnProperty.call(b, property)) return 0
        if (a[property] < b[property]) return -1
        if (a[property] > b[property]) return 1
        return 0
    })
}