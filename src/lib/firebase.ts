import {initializeApp} from 'firebase/app'
import {getFirestore} from 'firebase/firestore'
import {getAuth} from 'firebase/auth'
import {getStorage} from 'firebase/storage'
import {getDatabase} from 'firebase/database'

const firebaseConfig = {
    apiKey: "AIzaSyBeEyVFtXLpZpdndzO1hTIC-xMG_-yIqio",
    authDomain: "catalogo-pi.firebaseapp.com",
    projectId: "catalogo-pi",
    storageBucket: "catalogo-pi.appspot.com",
    messagingSenderId: "307123052594",
    appId: "1:307123052594:web:59bfe23b854618594a9c2b"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)
const storage = getStorage(app)
const rtdb = getDatabase(app)

export {app, db, auth, storage, rtdb}