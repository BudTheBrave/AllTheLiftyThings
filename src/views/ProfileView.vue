<template>
    <div>
        <div class="header">
            <div v-if="userData.displayName">
                <h2>{{ userData.displayName }}</h2>
                <p>{{  userData.email }}</p>
            </div>
            <h2 v-else>{{ userData.email }}</h2>
        </div>
        <div>
            <p>MORE COMMING SOON</p>
        </div>
        <!-- <div class="updatename">
            <div v-if="(userData.displayName)">
                <p>Change Name</p>
                <BaseInputVue 
                    type="text"
                    v-model="newName"
                    placeholder="New name here"
                    style="width: 150px"
                />
                <button @click="confirmNewName()">Submit</button>
            </div>
        </div> -->
        

    </div>
</template>

<script setup>
import {useUserStore} from "../stores/userStore.js"
import {storeToRefs} from 'pinia'
// import BaseInputVue from "@/components/BaseInput.vue";
// import { ref } from "vue";

const userStore = useUserStore();
const {userData} = storeToRefs(userStore);

// const newName = ref("");

// function confirmNewName() {
//     if(newName.value){
//         const msg = "Are you sure you would like \"" + newName.value + "\" as your profile name?"
//         const confirmed = confirm(msg)
//         console.log("gets called?", confirmed)
//     }
    
// }

</script>

<style lang="scss" scoped>
.header {
    margin: 5px;

    h2 {
        margin: 5px 5px 0 5px;
    }

    p {
       font-size: 0.6em; 
       margin-top: 0px;
    }
}

.updatename {
    display: flex;
    flex-direction: column;
    width: 170px;
    text-align: left;
    margin-left: 5px;
    margin-top: 20px;

    p {
        margin: 0;
        padding: 3px;
    }

    button {
        margin-top: 5px;
        border-radius: 0%;
    }
}



</style>