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

const registerCatalogViewEvent = async (catalogUrl: string) => {
    if (!catalogUrl) return false

    const catalogsRef = collection(db, 'catalogs')
    const catalogQuery = query(catalogsRef, where('url', '==', catalogUrl), limit(1))
    const snapshots = await getDocs(catalogQuery)

    if (snapshots.empty) return false

    const {id: catalogId} = snapshots.docs[0]
    const now = Date.now()
    const clientIdentifier = getClientIdentifier()
    const eventRef = ref(rtdb, `analytics/${catalogId}/catalogView/${now}`)

    await set(eventRef, {
        date: new Date(now).toString(),
        clientIdentifier,
        catalogId
    })
}

export const analytics = {
    registerCatalogViewEvent
}