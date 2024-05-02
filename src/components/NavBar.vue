<template>
    <div style="height: 30px">
        <hr class="topHr">

        <nav>
            <div class="navDiv">
                <RouterLink active-class="active" to="/">Home</RouterLink>
                <RouterLink active-class="active" to="/browse">Browse</RouterLink>
                <RouterLink active-class="active" to="/admin">Admin</RouterLink>
                <RouterLink active-class="active" to="/signin" v-if="!isLoggedIn">Sign In</RouterLink>
                <button @click="handleSignOut" v-if="isLoggedIn">logOut</button>
            </div>
        </nav>

        <hr class="bottomHr">

    </div>
</template>

<script setup>
import { RouterLink, useRouter } from "vue-router"
import { onMounted , ref} from 'vue';
import firebase from "firebase/compat/app";
import 'firebase/compat/auth'

const router = useRouter();



const handleSignOut = () => {
    firebase.auth().signOut().then(() => {
        router.push("/")
    });
};

</script>

<style scoped>
    .topHr {
    margin: 3px 0px 0px 0px;
    padding: 0px;
}

.bottomHr {
    margin: 0px;
    padding: 0px;
}

.navDiv {
    display: flex;
    background-color: lightgray !important;
    width: 100%;
    justify-content: space-evenly;
    max-height: 23px;
    height: 23px;
    margin: 0px 0px 0px 0px;
}

.navDiv a {
    color: black;
    text-decoration: none;
    font-size: 2.25vh;
    -webkit-tap-highlight-color: transparent !important;
}


.active {
    font-weight: bold;
    background-color: darkgray;
}
</style>
