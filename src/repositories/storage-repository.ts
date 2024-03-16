import {storage} from "@/lib/firebase.ts";
import {getDownloadURL, ref, deleteObject, uploadBytes} from "firebase/storage";
import {v4 as uuid} from 'uuid'

export const storageRepository = {
    getProductPhotoSrc: (filename: string) => {
        const photoRef = ref(storage, `products/${filename}`)
        return getDownloadURL(photoRef)
    },
    getBannerPhotoSrc: (filename: string) => {
        const photoRef = ref(storage, `banners/${filename}`)
        return getDownloadURL(photoRef)
    },
    uploadBanner: async (src: string) => {
        const blob = await (await fetch(src)).blob()
        const ext = blob.type.split('/')[1]
        const filename = `${uuid()}.${ext}`
        const bannerRef = ref(storage, `banners/${filename}`)
        await uploadBytes(bannerRef, blob)
        return filename
    },
    deleteBanner: async (filename: string) => {
        const bannerRef = ref(storage, `banners/${filename}`)
        await deleteObject(bannerRef)
    },
    replaceBanner: async (oldFilename: string|null, newSrc: string|null) => {
        if (oldFilename === newSrc) return newSrc
        if (oldFilename) await storageRepository.deleteBanner(oldFilename)
        return newSrc ? await storageRepository.uploadBanner(newSrc) : null
    }
}