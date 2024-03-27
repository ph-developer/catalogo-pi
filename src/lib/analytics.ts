import {v4 as uuid} from "uuid";
import {ref, set} from "firebase/database";
import {collection, limit, query, where, getDocs} from "firebase/firestore";
import {rtdb, db} from "@/lib/firebase.ts";

const getClientIdentifier = () => {
    let clientIdentifier = localStorage.getItem('clientIdentifier')
    if (!clientIdentifier) {
        clientIdentifier = uuid()
        localStorage.setItem('clientIdentifier', clientIdentifier)
    }
    return clientIdentifier
}

const getDeviceType = ():'desktop'|'mobile' => {
    const userAgent = window.navigator.userAgent.toLowerCase()
    const mobileDevices = ['android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone']

    if (mobileDevices.some((device) => userAgent.includes(device))) {
        return 'mobile'
    } else {
        return 'desktop'
    }
}

const registerCatalogViewEvent = async (catalogUrl: string) => {
    if (!catalogUrl) return false

    const catalogsRef = collection(db, 'catalogs')
    const catalogQuery = query(catalogsRef, where('url', '==', catalogUrl), limit(1))
    const snapshots = await getDocs(catalogQuery)

    if (snapshots.empty) return false

    const {id: catalogId} = snapshots.docs[0]
    const now = Date.now()
    const clientIdentifier = getClientIdentifier()
    const device = getDeviceType()
    const eventRef = ref(rtdb, `analytics/${catalogId}/catalogView/${now}`)

    await set(eventRef, {
        date: new Date(now).toString(),
        clientIdentifier,
        catalogId,
        device
    })
}

const registerProductViewEvent = async (catalogUrl: string, productId: string) => {
    if (!catalogUrl || !productId) return false

    const catalogsRef = collection(db, 'catalogs')
    const catalogQuery = query(catalogsRef, where('url', '==', catalogUrl), limit(1))
    const snapshots = await getDocs(catalogQuery)

    if (snapshots.empty) return false

    const {id: catalogId} = snapshots.docs[0]
    const now = Date.now()
    const clientIdentifier = getClientIdentifier()
    const device = getDeviceType()
    const eventRef = ref(rtdb, `analytics/${catalogId}/productView/${now}`)

    await set(eventRef, {
        date: new Date(now).toString(),
        clientIdentifier,
        catalogId,
        productId,
        device
    })
}

export const analytics = {
    registerCatalogViewEvent,
    registerProductViewEvent
}