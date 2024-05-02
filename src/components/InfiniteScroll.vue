<template>
    <div>
        <div ref="displayRef" class="dataContainer">
            <div v-for="stunt in stuntList" :key="stunt">
                <display-primary-info-card 
                    :stunt-data="stunt"
                />
            </div>
            <p v-show="fetchingData || allLoaded">
                {{ fallbackMsg }}
            </p>
        </div>
    </div>
</template>

<script setup>

import DisplayPrimaryInfoCard from '../components/DisplayPrimaryInfoCard.vue';
import { getStuntsWithLimit } from '@/firebase/stuntOperations';
import { ref, defineProps, watch } from 'vue';
import { useInfiniteScroll } from '@vueuse/core'


const props = defineProps({
    searchParams: {
        type: Object,
        default: null
    }})

//get html ref
const displayRef = ref(null);

//set limit 
const stuntsToShow = 15;

//lastDoc retrivied by api call
let lastMainDoc = null
let lastAltNameDoc = null
let allLoaded = false
const fallbackMsg = ref('Fetching Data... Please Hold')
const fetchingData = ref(null)
const stuntList = ref()
let numberOfStuntsRetrived = null


watch(() => props.searchParams, async () => {
    try{
        resetVars();
        console.log("TEST IF RAN FIRST")
        const getStuntData = await getStuntsWithLimit(stuntsToShow, null, null, props.searchParams)
        lastMainDoc = getStuntData.lastMainDoc
        lastAltNameDoc = getStuntData.lastAltNameDoc
        console.log("last doc", lastMainDoc)
        console.log("last doc", lastAltNameDoc)
        if(getStuntData?.data == [] || !getStuntData?.data){
            console.log("ALLLOASEDTRUE??!?!?!?")
            allLoaded = true
            fallbackMsg.value = "stunts could not be retrived"
        } else {
            stuntList.value = await getSpreadData(getStuntData.data)
            console.log(stuntList.value, "List of stunts are")
            numberOfStuntsRetrived = getStuntData.data.length
        }  
        
        useInfiniteScroll(
            displayRef,
            async () => {
                await getStuntsOnScroll()
            },
            { distance: 0,
            canLoadMore: () => !allLoaded }
        )

    } catch(err) {
        console.error(err)
    }
}, { immediate: true})




function resetVars() {
    lastMainDoc = null
    lastAltNameDoc = null
    allLoaded = false
    fallbackMsg.value = 'Fetching Data... Please Hold'
    fetchingData.value = null
    stuntList.value = null
    numberOfStuntsRetrived = null
    }





async function getStuntsOnScroll() {
    console.log("ONNNNN NOOOOOOOOO", numberOfStuntsRetrived)
    fetchingData.value = true;
    try {
        if(numberOfStuntsRetrived >= stuntsToShow){
            const newStunts = await getStuntsWithLimit(stuntsToShow, lastMainDoc, lastAltNameDoc, props.searchName);
            lastMainDoc = newStunts.lastMainDoc;
            lastAltNameDoc = newStunts.lastAltNameDoc
            numberOfStuntsRetrived = newStunts.data.length
            console.log("new lastDoc", lastMainDoc)
            console.log("new lastAltDoc", lastAltNameDoc)
            console.log("New stunts are", newStunts)
            const newStuntSpread = await getSpreadData(newStunts.data);
            stuntList.value.push(...newStuntSpread)
        } else {
            fallbackMsg.value = "All Loaded"
            allLoaded = true
        }
        console.log("this is a loop")
        fetchingData.value = null
        
    } catch (err) {
        fetchingData.value = null
        console.log(err, "error")
    }
}


function getSpreadData(data){
    return new Promise((reslove) => {
    console.log("data in spead data is", data)
    let currentData = JSON.parse(JSON.stringify(data));
    let newData = [];
    console.log("current data var is", currentData)
    currentData.forEach((stunt, stuntIndex) => {
        if(stunt.nameAndDisciplines.length > 1){
            stunt.nameAndDisciplines.forEach((nameAndDiscipline, nameAndDisciplineIndex) =>{
                let currentStuntData = JSON.parse(JSON.stringify(stunt));
                currentStuntData.nameAndDisciplines.splice(nameAndDisciplineIndex, 1)
                currentStuntData.nameAndDisciplines.unshift(nameAndDiscipline);
                newData.splice(stuntIndex+nameAndDisciplineIndex+1, 0, currentStuntData)
            })
            console.log(currentData)
        } else {
            newData.push(stunt)
        }
    })
    
    console.log(newData)
    reslove(newData)
})
}

</script>

<style lang="scss" scoped>
.dataContainer {
    max-height: calc(100vh - 111px);
    overflow: scroll;
}
</style>