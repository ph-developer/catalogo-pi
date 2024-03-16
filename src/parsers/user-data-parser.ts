import {DocumentData, QueryDocumentSnapshot} from "firebase/firestore";
import {UserData} from "@/types/user-data";

export const userDataParser = {
    fromFirebase: (
        doc: QueryDocumentSnapshot<DocumentData, DocumentData>,
    ): UserData => ({
        id: doc.id,
        catalogIds: doc.get('catalogIds')
    })
}