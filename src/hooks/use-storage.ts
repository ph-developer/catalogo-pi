import {deleteObject, getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {storage} from "@/lib/firebase.ts";
import {v4 as uuid} from "uuid";

type ImgType = 'product' | 'banner'

export const useStorage = () => {
    const getImgSrc = async (imgType: ImgType, filename: string) => {
        if (imgType !== 'product' && imgType !== 'banner') return ''
        const photoRef = ref(storage, `${imgType}s/${filename}`)
        return getDownloadURL(photoRef)
    }

    const getImgSrcFn = (imgType: ImgType, filename: string) => {
        return () => getImgSrc(imgType, filename)
    }

    const uploadImg = async (imgType: ImgType, src: string)=> {
        if (imgType !== 'product' && imgType !== 'banner') return null
        const blob = await (await fetch(src)).blob()
        const ext = blob.type.split('/')[1]
        const filename = `${uuid()}.${ext}`
        const bannerRef = ref(storage, `${imgType}s/${filename}`)
        await uploadBytes(bannerRef, blob)
        return filename
    }

    const deleteImg = async (imgType: ImgType, filename: string) => {
        if (imgType !== 'product' && imgType !== 'banner') return
        const bannerRef = ref(storage, `${imgType}s/${filename}`)
        await deleteObject(bannerRef)
    }

    return {
        getImgSrc,
        getImgSrcFn,
        uploadImg,
        deleteImg
    }
}