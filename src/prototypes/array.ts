// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare interface Array<T> {
    intersection(arr: T[]): T[]
    diff(arr: T[]): T[]
    symDiff(arr: T[]): T[]
}

Array.prototype.intersection = function<T>(this: T[], arr: T[]): T[] {
    return this.filter((x) => arr.includes(x))
}

Array.prototype.diff = function<T>(this: T[], arr: T[]): T[] {
    return this.filter((x) => !arr.includes(x))
}

Array.prototype.symDiff = function<T>(this: T[], arr: T[]): T[] {
    return this.filter((x) => !arr.includes(x))
        .concat(arr.filter((x) => !this.includes(x)))
}