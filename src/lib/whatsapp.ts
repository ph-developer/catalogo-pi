export const makeWhatsappUrl = (number: string, text: string|null = null) => {
    let url = `https://api.whatsapp.com/send?phone=${number}`
    if (text !== null) url += `&text=${text}`
    return url
}