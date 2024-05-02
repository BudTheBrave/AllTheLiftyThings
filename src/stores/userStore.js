import { defineStore } from 'pinia'
import { getUserData } from '@/firebase/userOperations'

export const useUserStore = defineStore('user',{
    state: () => ({
        isLoggedIn: false,
        user: "",
        userData: {}
        //add favorites and saved
    }),
    actions: {
        async setUser(user){
            this.user = user
            this.userData = await getUserData(user.uid)
            console.log("user store updated", this.userData)
        },
        loggedIn(boolean){
            this.isLoggedIn = boolean
        },
        $logOut(){
            this.user = ""
            this.userData = ""
            this.isLoggedIn = false
            //add favorites and bookmarked
        },
        updateUserData(userData){
            this.userData = userData
        }
       
    },
    getters: {
       
    },
    persist: {
        key: "__Pinia_State__User",
        storage: sessionStorage

    }
})