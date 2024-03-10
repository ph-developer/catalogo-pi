import axios from 'axios'

const getCurrentPosition = () => new Promise<GeolocationPosition>((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject))

interface LocationData {
    city: string
}

export const getCurrentCity = async () => {
    const position = await getCurrentPosition()
    const {latitude, longitude} = position.coords
    const {data} = await axios.get<LocationData>(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=pt-br`)
    
    return data.city
}