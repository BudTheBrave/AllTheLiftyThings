<template>
    <div class="body-wrapper">
        <div v-if="!loading" class="search-wrapper">
            <div>
                <BaseInput v-model="name" 
                type="text" placeholder="Name *Required*"
                style="padding-right: 5px"/>
                <BaseDropdown 
                :options="disciplineDropdownConfig"
                placeholder="Discipline *Required*"
                v-model="discipline"/>    
            </div>
            <button @click="submitSearchForStunt">Search</button>
        </div>
        <h2 v-if="msg" style="margin-top: 20px;">{{ msg }}</h2>
        <div v-if="loading">
            <div class="loading-header">
                <a @click.prevent="backToSearch" class="back">
                    <img :src="goBackIcon" alt="go back icon"/>
                    <p>Back</p>
                </a>
                <p>Resutls for <b>{{ capitalizeFirstLetters(name) }}</b></p>
            </div>
            <Suspense>
                <infinite-scroll :search-params="searchParams"/>
                <template #fallback>
                    <p>...Loading</p>
                </template>
            </Suspense>
        </div>
    </div>
</template>

<script setup>
import BaseInput from '@/components/BaseInput.vue';
import BaseDropdown from '@/components/BaseDropdown.vue';
import { disciplineDropdownConfig } from '../Mixins'
import InfiniteScroll from '@/components/InfiniteScroll.vue';
import { ref } from 'vue';
import goBackIcon from '../assets/goBackIcon.png'
import { capitalizeFirstLetters } from '../Mixins';


const loading = ref(false)
const name = ref("");
const discipline = ref("all");
const searchParams = ref("")
const msg = ref("")

function submitSearchForStunt() {
    if(!name.value || name.value == "" || typeof name.value != "string" ) {
        msg.value = "Invalid Name"
        return
    }
    msg.value = ""
    searchParams.value = {
        name,
        discipline
    }
    loading.value = true
}

function backToSearch() {
    loading.value = false
    name.value = "";
    discipline.value = "all";
    searchParams.value = ""
    msg.value = ""
}

</script>

<style lang="scss" scoped>
.search-wrapper{
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    text-align: center;
    margin-top: 20px;

    button {
        height: 20px;
        align-self: center;
    }
}

.loading-header {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    height: 30px;


    .back {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        img {
            height: 30px;
            width: auto;
            background-color: white;
            border-radius: 50%;
        }

        p {
            margin-left: 5px;
            align-self: center;
        }

    }

    
    
    p {
        margin: 0;
        align-self: center;
    }
}

</style>