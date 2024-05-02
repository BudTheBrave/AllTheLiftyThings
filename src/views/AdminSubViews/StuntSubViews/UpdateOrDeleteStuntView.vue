<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from "vue"
import { getDisciplineIcon, capitalizeFirstLetters } from '../../../Mixins';
import { updateStunt, deleteStunt } from '../../../firebase/stuntOperations'
import { disciplineDropdownConfig, elevationDropdownConfig, movementConfig } from '../../../Mixins';
import { useStuntStore } from "../../../stores/stuntStore";
import { uploadNewStuntMediaToBucket, removeAllMediaFromFolder, removeMedia } from "../../../firebase/storageOperations"
// import components
import BaseInput from '@/components/BaseInput.vue';
import BaseDropdown from '../../../components/BaseDropdown.vue';
import UploadFile from '@/components/UploadFile.vue';


const router = useRouter();
const storeStunt = useStuntStore();



const fileInputElement = ref(null);
const deleteButtonValue = ref("DELETE");
const deleteCaptcha = ref("");
const deleteResponce = ref("");

var isUploadMediaSuccess = [];

// variables for getting all the info into an object
const name = ref("");
const discipline = ref("");
const nameAndDisciplines = ref([]);
const difficulty = ref();
const elevation = ref("");
const movement = ref("");
const popStatus = ref(false);
const disconnectsStatus = ref(false);
const counterBalanceStatus = ref(false);
const altName = ref("");
const altNames = ref([]);
const notes = ref("");
const files = ref([]);
const demonstrators = ref({})
const newMedia = ref([])




onMounted(() => {
    const storedStuntState = storeStunt.$state;
    console.log(storedStuntState)

    nameAndDisciplines.value = [...storedStuntState.nameAndDisciplines];
    difficulty.value = storedStuntState.difficulty.toString();
    elevation.value = storedStuntState.elevation;
    movement.value = storedStuntState.movement;
    popStatus.value = storedStuntState.isPop
    disconnectsStatus.value = storedStuntState.disconnects
    counterBalanceStatus.value = storedStuntState.isCounterBalance
    altNames.value = [...storedStuntState.altNames];
    notes.value = storedStuntState.notes
    storedStuntState.media.forEach(mediaData => {
        fileInputElement.value.presetMedia(mediaData);
    })

})



function createUpdateConfig() {
    const stuntState = storeStunt.$state;
    const config = {}

    if(JSON.stringify(nameAndDisciplines.value) != JSON.stringify(stuntState.nameAndDisciplines)){
        config['nameAndDisciplines'] = nameAndDisciplines.value
    }
    if(difficulty.value != stuntState.difficulty){
        config['difficulty'] = difficulty.value
    }
    if(elevation.value != stuntState.elevation){
        config['elevation'] = elevation.value
    }
    if(movement.value != stuntState.movement){
        config['movement'] = movement.value
    }
    if(popStatus.value != stuntState.isPop){
        config['isPop'] = popStatus.value
    }
    if(counterBalanceStatus.value != stuntState.isCounterBalance){
        config['isCounterBalance'] = counterBalanceStatus.value
    }
    if(disconnectsStatus.value != stuntState.disconnects){
        config['disconnects'] = disconnectsStatus.value
    }
    if(JSON.stringify(altNames.value) != JSON.stringify(stuntState.altNames)){
        config['altNames'] = altNames.value
    }
    if(notes.value != stuntState.notes){
        config['notes'] = notes.value
    }
    return config
}

function isSubmitConfigValid(submitConfig) {

    const keys = Object.keys(submitConfig);
    const values = Object.values(submitConfig);

    const validatedKeys = {}
    for(var i = 0; i < keys.length; i++) {
        if(values[i] == null || values[i] == "" || values[i] == []){
            if(keys[i] == "notes" || keys[i] == "altNames" || keys[i] == "isPop" || keys[i] == "disconnects" || keys[i] == "isCounterBalance" || keys[i] == "media") {
                validatedKeys[keys[i]] = true;
            } else {
                validatedKeys[keys[i]] = false;
            } 
        } else {
            validatedKeys[keys[i]] = true;
        }
    }

    var isValid = !Object.values(validatedKeys).some(value => (value == false))

    return isValid;

}





function addNameAndDisciplines(nameParam, disciplineParam){
    console.log(storeStunt.$state.nameAndDisciplines, "add naeme and discipline")

    // check to see if both boxes are filled
    if(!(nameParam && disciplineParam)) {
        return;
    }

    let name = capitalizeFirstLetters(nameParam);
    let discipline = disciplineParam

    let matcingDisciplineInArray = nameAndDisciplines.value.find(nameAndDiscipline => nameAndDiscipline.discipline === discipline);
    if(matcingDisciplineInArray){
            console.log("same discipline error")
            matcingDisciplineInArray.name = name;
        
    } else {
        nameAndDisciplines.value.push({
            'name': name,
            'discipline': discipline
        }) 
    }
    clearNameAndDisciplineFields();

}

function addAltName(nameParam) {
    if(nameParam === ""){
        return;
    }
    const name = capitalizeFirstLetters(nameParam)

    if (name != altNames.value.find(n => n === name)){
        altNames.value.push(name);
        clearAltNameField();
    }
} 

const submitToDatabase = async () => {
    const submitConfig = createUpdateConfig();

    

    if(isSubmitConfigValid(submitConfig)){
        var folderId = storeStunt.$state.media[0]?.folderId || Math.random().toString(20).substring(2,15);
        let existingMedia = [...storeStunt.$state.media]
        let media = [...newMedia.value] || [];
        let idToDelete = []

        console.log(existingMedia, "existing media")
        console.log(media, "new media minus file uploads")

        existingMedia.forEach(async (existingMediaData) => {
            if(media.find(mediaData => mediaData.id == existingMediaData.id)){
                //theres and equal id dont delete
                console.log("ids are the same", existingMediaData.id)
            } else {
                // id not matched in media data delete existing id
                idToDelete.push(existingMediaData.folderId + '/' + existingMediaData.name)
                await removeMedia(existingMediaData.folderId, existingMediaData.name)
            }
        })

        console.log("ids to delete", idToDelete)

        
        // attempt to post files to strorage
        // file are new files
        if(files.value.length) {
            //implement later demonstrators should link to there user ID
            for (var i = 0; i < files.value.length; i++) {
                const file = files.value[i];
                await uploadNewStuntMediaToBucket(folderId , file)
                .then(result => {
                    const mediaInfo = {
                        id: Math.random().toString(20).substring(2,13),
                        name: file.name,
                        folderId,
                        type: file.type,
                        mediaURL: result,
                        demonstrators: demonstrators.value['file_' + i] || ""
                    }
                    console.log("before media push", mediaInfo)
                    media.push(mediaInfo);
                    console.log("after media push")
                    isUploadMediaSuccess.push(true)
                })
                .catch((error) => {
                    alert(error);
                    isUploadMediaSuccess.push(false);
                })

            }
        }

        submitConfig.media = media;
        const hasFalseInMediaUpload = isUploadMediaSuccess.find(value => value == false)
        if(hasFalseInMediaUpload){
            return;
        }
        
        console.log(submitConfig, "config")
        const updateStuntSuccess = await updateStunt(storeStunt.$state.stuntId, submitConfig)
        if(updateStuntSuccess) {
            clearInputBoxes();
            storeStunt.$reset();
            router.push("/admin/manageStunt")
        } else {
            alert("could not updated stunt")
            console.log("deleting uploaded items");
            if(folderId != ""){
                removeAllMediaFromFolder(folderId)
            }
        }
    } else {
        console.log("submit fig not valid")
    }
}

function clearInputBoxes() {
    clearNameAndDisciplineFields();
    nameAndDisciplines.value = [];

    difficulty.value = ""    
    elevation.value = "";
    movement.value = "";

    popStatus.value = false;
    disconnectsStatus.value = false;
    counterBalanceStatus.value = false;

    clearAltNameField();
    altNames.value = [];

    notes.value = "";

    // clear stuff from chuld componet
    demonstrators.value = [];
    fileInputElement.value.clearAll()
}
function clearNameAndDisciplineFields() {
    name.value = "";
    discipline.value = "";
}

function clearAltNameField() {
    altName.value = "";
}


function removeEntry(array, index) {
    array.splice(index, 1)
}

function getFiles(event) {
    files.value = event;
}

function getDemonstrators(event) {
    demonstrators.value = event;
}

function getNewMedia(event) {
    newMedia.value = event
}

function verifyDeleteToggle(){
    deleteButtonValue.value = deleteButtonValue.value != "DELETE" ? "DELETE" : "Back"
    deleteCaptcha.value = Math.random().toString(20).substring(2,7)
}

async function verifyDelete() {
    if(deleteResponce.value == deleteCaptcha.value){
        //delete
        console.log("file to delete", storeStunt.$state.stuntId)
        await deleteStunt(storeStunt.$state.stuntId);
        router.push("/admin/manageStunt")
    }
}

</script>

<template>
    <div v-if="deleteButtonValue == 'DELETE'">
        <div @click="router.go(-1)">Go Back</div>
        <h1>Update Stunt</h1>

        <div class="nameAndDiscipline-container">
            <div class="nameAndDiscipline-wrapper">
                <BaseInput 
                    v-model="name" 
                    type="text"    
                    placeholder="Name *Required*"
                    style="padding-right: 5px"
                />
                <BaseDropdown 
                    :options="disciplineDropdownConfig"
                    placeholder="Discipline *Required*"
                    v-model="discipline"
                />
            </div>
            <button @click="addNameAndDisciplines(name, discipline)">Add</button>
        </div>
        <div v-if="nameAndDisciplines != []">
            <div v-for="(nameAndDiscipline, index) in nameAndDisciplines" :key="nameAndDiscipline">
                <span>{{ getDisciplineIcon(nameAndDiscipline.discipline) }} {{ nameAndDiscipline.name }}</span>
                <button @click="removeEntry(nameAndDisciplines, index)">X</button>
            </div>
        </div>
        <div class="moreInfo-wrapper">
            <div>
                <BaseInput 
                    v-model="difficulty"
                    type="number" 
                    placeholder="Difficulty" 
                />
                <BaseDropdown  
                    :options="elevationDropdownConfig"
                    placeholder="Elevation"
                    v-model="elevation"
                />
                <BaseDropdown  
                    :options="movementConfig"
                    placeholder="Movement"
                    v-model="movement"
                />
            </div>
            <div>
                <input type="checkbox" v-model="popStatus"/>
                <span>Pop</span>
                <input type="checkbox" v-model="disconnectsStatus"/>
                <span>Disconnects</span>
                <input type="checkbox" v-model="counterBalanceStatus"/>
                <span>Counter Balance</span>
            </div>
        </div>
        <div style="display: flex; flex-direction: row;">
            <BaseInput 
                v-model="altName" 
                style="padding-right: 10px;"
                type="text" 
                placeholder="Alternative Names" 
            />
            <button @click="addAltName(altName)">Add</button>
        </div>
        <div v-for="name in altNames" :key="name">
            <span>{{ name }}</span>
            <button @click.prevent="removeEntry(altNames, index)">X</button>
        </div>
        <div>
            <textarea 
                v-model="notes"
                placeholder="Notes" 
                type="text" 
                style="width: 330px; height: 100px; padding: 5px; margin-top: 5px" >
            </textarea>
        </div>
        <!-- insert files and data -->
        <UploadFile 
            @pushFiles="getFiles($event)" 
            @pushDemonstrators="getDemonstrators($event)"
            @pushExistingMedia="getNewMedia($event)"
            ref="fileInputElement" 
        />
        
        <button @click.prevent="submitToDatabase">Confirm</button>
        <button @click.prevent="clearInputBoxes">Clear</button>
    </div>
    <button class="deleteButton" @click="verifyDeleteToggle()">{{ deleteButtonValue }}</button>
    <div v-if="deleteButtonValue == 'Back'">
        <h1>WARNING deletion is permanent</h1>
        <p>To comfirm deletion type </p>
        <p style="font-weight: bold;">{{ deleteCaptcha }}</p>
        <div class="deleteInputWrapper">
            <BaseInput
                v-model="deleteResponce"
                type="text"
                placeholder="confirm here"
                class="deleteInput"
            />
        </div>
        <button @click="verifyDelete()">delete</button> 
    </div>
</template>

<style scoped>
.deleteButton {
    margin-top: 20px;
    color: black;
    background-color: red;
}


.deleteInputWrapper {
    display: flex;
    justify-content: center;
}

</style>
