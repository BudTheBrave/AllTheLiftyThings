<template>
    <div>
        <h1>Sign In to an Account</h1>
        <p><BaseInput 
            label="Email" 
            placeholder="Example@text.com"
            v-model="email"/></p>
        <p><BaseInput 
            type="password" 
            label="Password" 
            placeholder="Password"
            v-model="password" /></p>
        <p v-if="errMsg">{{ errMsg }}</p>
        <p><button @click="signIn">Sign In</button></p>
        <p><button @click="signInWithGoogle">Sign In With Google</button></p>
        <p><button @click="router.push('/register')">Create Account</button></p>
   </div>
</template>

<script setup>
import { ref } from "vue"
import BaseInput from '../components/BaseInput.vue'
import { auth, namespaceAuth } from '../firebase/index.js'
import { useRouter } from "vue-router";
import { isAnUser, addUser } from "../firebase/userOperations.js"

const router = useRouter();

const email = ref("");
const password = ref("")
const errMsg = ref();


const signIn = () => {
    auth.signInWithEmailAndPassword(email.value, password.value)
        .then((data) => {
            console.log("Successfully registered", data);
            console.log(auth.currentUser)
            router.push('/')
        })
        .catch((error) => {
            console.log(error.code);
            switch (error.code) {
                case "auth/invalid-email":
                    errMsg.value = "Invalid Email";
                    break;
                case "auth/user-not-found":
                    errMsg.value = "No account with that email was found";
                    break;
                case "auth/wrong-password":
                    errMsg.value = "Inncorrect Password";
                    break;   
                default:
                    errMsg.value = "Email or password was incorrect";
                    break;         }
            alert(error.message);
        })

}

const signInWithGoogle = () => {
    const provider = new namespaceAuth.GoogleAuthProvider()
    provider.addScope('profile')
    provider.addScope('email');
    auth.signInWithPopup(provider)
    .then(async (result) => {
            console.log(result.user);
            const isAnCurrentUser = await isAnUser(result.user.uid);
            if(!isAnCurrentUser){
                console.log("adding new user")
                await addUser(result.user)
            }
            router.push("/")
        }
    ).catch((error) => {
        console.log(error);
    })
}



    
</script>

<style scoped>
p {
    display: flex;
    justify-content: center;
}

</style>