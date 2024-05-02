<template>
    <div v-if="!matchingStuntsId.length">
        <div>
            <h1>Manage Stunts</h1>

            <BaseInput v-model="name" 
                type="text" placeholder="Name *Required*"
                style="padding-right: 5px"/>
            <BaseDropdown 
                :options="disciplineDropdownConfig"
                placeholder="Discipline *Required*"
                v-model="discipline"/>

            <button @click="submitSearchForStunt">Search</button>
        </div>
        <div v-if="msg"> {{ msg }}</div>
    </div>
    <!-- choose stunt that matches -->
    <div v-if="searchParams">
        <div v-if="searchParams.length != 0">
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
import { ref } from 'vue';
import { useRouter } from 'vue-router'
import { disciplineDropdownConfig, capitalizeFirstLetters } from '../../../Mixins'
import { searchForStunt } from '../../../firebase/stuntOperations';
import { useStuntStore } from '@/stores/stuntStore';
import InfiniteScroll from '@/components/InfiniteScroll.vue';
import goBackIcon from '../../../assets/goBackIcon.png'



const router = useRouter();
const storeStunt = useStuntStore()

const matchingStuntsId = ref([])
const searchParams = ref(null)
const msg = ref(null)

const name = ref("");
const discipline = ref("");


const submitSearchForStunt = async () => {
    storeStunt.$reset()
    //no discipline was selected search for name only
    if(!discipline.value) {
        discipline.value = "";
    }
    if(!name.value){
        msg.value = "Enter a name"
        return
    } else {
        msg.value = null
    }
    // consolelog and id statmet running before function finishes excuting
    matchingStuntsId.value = await searchForStunt(name.value, discipline.value);
    
    if(!matchingStuntsId.value.length){
        storeStunt.replaceNameAndDiscipline({
            name: name.value,
            discipline: discipline.value
        })
        router.push({
            name: `addNewStunt`,
        })
    } 
    else {
        searchParams.value = {"ids": matchingStuntsId.value}
    }
    //     matchingStuntsId.value.forEach(async (id) =>  {
//             const stuntData = await getStunt(id);

//             stuntData.nameAndDisciplines.forEach(nameAndDiscipline => {
//                 if(nameAndDiscipline.name == capitalizeFirstLetters(name.value)) {
//                     let data = {}
//                     if(!discipline.value) {
//                         data = {
//                             id,
//                             'name': nameAndDiscipline.name,
//                             'discipline': nameAndDiscipline.discipline,
//                             'data': stuntData
//                         }
//                         if(data){matchingStuntData.value.push(data)}
//                     } else {
//                         if(nameAndDiscipline.discipline == discipline.value){
//                             data = {
//                                 id,
//                                 'name': nameAndDiscipline.name,
//                                 'discipline': nameAndDiscipline.discipline
//                             }
//                             if(data){matchingStuntData.value.push(data)}
//                         }
//                     }
//                 }
                

//             })

//             stuntData.altNames.forEach(altName => {
//                 let data = {}
//                 if(altName == capitalizeFirstLetters(name.value)) {
//                     data = {
//                         id,
//                         'altName': altName,
//                         'data': stuntData
//                     }
//                     if(data){matchingStuntData.value.push(data)}
//                 }
                
//             })
    //     });
    // }
    
}

// function stuntSelected(id, data, selectedType) {
//     if(!selectedType){
//         selectedType = 'altName'
//     }
//     storeStunt.setPulledData(id, toRaw(data), selectedType);
//     router.push({
//         name: 'updateOrDeleteStunt'
//     })
// }

function backToSearch() {
    matchingStuntsId.value = [];
    searchParams.value = null
    name.value = "";
    discipline.value = "";
    msg.value = null
}


</script>

<style lang="scss" scoped>

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