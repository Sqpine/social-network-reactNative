import {getAuth} from "firebase/auth";
import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";

export const firebaseConfig = {
    apiKey: "AIzaSyC2WdO1jQ833NlbMompXmI2_ZXLRF7N9jk",
    authDomain: "socialnet-49cda.firebaseapp.com",
    projectId: "socialnet-49cda",
    storageBucket: "socialnet-49cda.appspot.com",
    messagingSenderId: "657878769622",
    appId: "1:657878769622:web:bd23ddd562332c8f950e77"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
export {auth, db, storage}
// Initialize Firebase

