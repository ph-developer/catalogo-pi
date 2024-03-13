// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare interface String {
    formatCnpj(): string
    formatPhone(): string
}

String.prototype.formatCnpj = function (this: string): string {
    if (this.length !== 14) return this
    return this.substring(0, 2) + '.' +
        this.substring(2, 5) + '.' +
        this.substring(5, 8) + '/' +
        this.substring(8, 12) + '-' +
        this.substring(12, 14)
}

String.prototype.formatPhone = function (this: string): string {
    let temp = '+' + this.substring(0, 2) + ' (' + this.substring(2, 4) + ') '
    if (this.length === 13) {
        temp += this.substring(4, 9)
    } else {
        temp += this.substring(4, 8)
    }
    return temp + '-' + this.substring(this.length - 4)
}