<template>
    <div>
        <h1>Create an Account</h1>
        <p><BaseInput 
            label="Email" 
            placeholder="Example@text.com"
            v-model="email" /></p>
        <p><BaseInput 
            type="password" 
            label="Password" 
            placeholder="Password"
            v-model="password" /></p>
        <p><button @click="register">Create Account</button></p>
        <p><button @click="router.go(-1)">Back</button></p>

   </div>
</template>

<script setup>
import { ref } from "vue"
import BaseInput from '../components/BaseInput.vue'
import { auth } from '../firebase/index.js'
import { useRouter } from "vue-router";
import { addUser } from "../firebase/userOperations.js"

const email = ref("");
const password = ref("")
const router = useRouter();

const register = () => {
    auth.createUserWithEmailAndPassword(email.value, password.value)
        .then( async (data) => {
            console.log("Successfully registered", data);
            console.log(auth.currentUser)
            await addUser(data.user);
            router.push('/') //TODO: to dashboard and add user to database
        })
        .catch((error) => {
            console.log(error.code);
            alert(error.message);
        })

}


    
</script>

<style scoped>
p {
    display: flex;
    justify-content: center;
}
</style>