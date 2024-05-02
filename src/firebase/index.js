import firebase from "firebase/compat/app";
import "firebase/compat/auth"
import "firebase/compat/firestore"
import "firebase/compat/storage"
import key from "./key";
import { useUserStore } from "@/stores/userStore";


// Initialize Firebase
const initFirebase = firebase.initializeApp(key);

const db = firebase.firestore();
const storage = firebase.storage()
const auth = firebase.auth()
const namespaceAuth = firebase.auth
const namespaceFirebase = firebase


function getCurrentUser() {
    return new Promise((reslove) => {
        const userStore = useUserStore()
        auth.onAuthStateChanged((user) => {
            if(user){
                userStore.setUser(user)
                userStore.loggedIn(true)
                console.log("user signed in")
                reslove(user);
            } else {
                userStore.$logOut()
                console.log("user signed out")
                //user signed out
                reslove(null)
            }
        })
    })
}

export {initFirebase, db, storage, auth, namespaceAuth, namespaceFirebase ,getCurrentUser};