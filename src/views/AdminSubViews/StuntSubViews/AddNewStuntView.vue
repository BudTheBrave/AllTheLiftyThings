<template>
    <div class="main-container">
        <div v-show="uploadStatus == 'WAITING'">

            <h1 style="margin: 0;">Add New Stunt</h1>
            
            <div class="nameAndDiscipline-container">
                <div class="nameAndDiscipline-wrapper">
                    <BaseInput 
                    v-model="name" 
                    type="text"    
                    placeholder="Name *Required*"
                    />
                    <p></p>
                    <BaseDropdown 
                    :options="disciplineDropdownConfig"
                    placeholder="Discipline *Required*"
                    v-model="discipline"
                    />
                </div>
                <div v-if="nameAndDisciplines != []" class="displayItems">
                    <div v-for="(nameAndDiscipline, index) in nameAndDisciplines" :key="nameAndDiscipline" class="items">
                        <span>{{ getDisciplineIcon(nameAndDiscipline.discipline) }} {{ nameAndDiscipline.name }}</span>
                        <button @click="removeEntry(nameAndDisciplines, index)" style="margin-left: 6px">X</button>
                    </div>
                </div>
                <button class="addButton" @click="addNameAndDisciplines(name, discipline)">Add</button>
            </div>
            <div class="moreInfo-wrapper">
                <div class="mainInfo">
                    <BaseInput 
                    v-model="difficulty"
                    type="number" 
                    placeholder="Difficulty *Required*" 
                    />
                    <BaseDropdown  
                    :options="elevationDropdownConfig"
                    placeholder="Elevation *Required*"
                    v-model="elevation"
                    />
                    <BaseDropdown
                    :options="movementConfig"
                    placeholder="Movement *Required*"
                    v-model="movement"
                    />    
                </div>
                <div class="extraInfo">
                    <span><input type="checkbox" v-model="popStatus"/>Pop</span>
                    <span><input type="checkbox" v-model="disconnectsStatus"/>Disconnects</span>
                    <span><input type="checkbox" v-model="counterBalanceStatus"/>Counter Balance</span>
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
                <button @click.prevent="removeEntry(altNames, index)" style="margin-left: 6px">X</button>
            </div>
            <div style="text-align: left;">
                <textarea 
                v-model="notes"
                placeholder="Notes" 
                type="text" 
                style="width: 310px; height: 100px; padding: 5px; margin-top: 5px;" >
                </textarea>
            </div>
            <!-- insert files and data -->
            <div class="file-container">
                <UploadFile
                    @pushFiles="getFiles($event)" 
                    @pushDemonstrators="getDemonstrators($event)"
                    @pushExistingMedia="getExistingUpdatedMedia($event)"
                    @pushPosterImage="getPosterImage($event)"
                    ref = "fileInputElement" 
                />
            </div>
        
            <button @click.prevent="submitToDatabase">Confirm</button>
            <button @click.prevent="clearInputBoxes">Clear</button>
        </div>
    
        <div v-if="uploadStatus">
            <p>{{ uploadStatus }}</p>
            <div v-if="uploadStatus == 'CONVERTING...' ||
                       uploadStatus == 'UPLOADING FILES'">
                <p>Media: {{ progress }}%</p>
                <p v-if="posterProgress != 0">Poster: {{ posterProgress }}%</p>
                <p>{{ fileCount }}</p>
            </div> 
            <div v-if="!(uploadStatus == 'CONVERTING...' || 
                       uploadStatus == 'UPLOADING FILES' || 
                       uploadStatus == 'POSTING' ||
                       uploadStatus == 'WAITING' ||
                       uploadStatus == 'POST SUCCESS')"
            >
                <button @click.prevent="changeStatus">go back</button>
            </div>
            <div v-else-if="uploadStatus == 'POST SUCCESS'">
                <button @click.prevent="toMainPage">back to main Page</button>
            </div>
        </div>

        
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, toRaw, onMounted, watch } from "vue"
import { getDisciplineIcon, capitalizeFirstLetters, convertVideosToMP4, makeId } from '../../../Mixins';
import { postStunt, updateStunt } from '../../../firebase/stuntOperations'
import { disciplineDropdownConfig, elevationDropdownConfig, movementConfig } from '../../../Mixins';
import { useStuntStore } from "../../../stores/stuntStore";
import { uploadNewStuntMediaToBucket, removeAllMediaFromFolder, removeMedia } from "../../../firebase/storageOperations"
// import components
import BaseInput from '@/components/BaseInput.vue';
import BaseDropdown from '../../../components/BaseDropdown.vue';
import UploadFile from '@/components/UploadFile.vue';
// import videoConverter from '../../../components/fileConverter.vue';


const router = useRouter();
const storeStunt = useStuntStore();


const storedNameAndDisciplines = storeStunt.nameAndDisciplines;

const fileInputElement = ref(null);

var isUploadMediaSuccess = [];
const filesToConvert = ref([])
const demonstratorsToConvert = ref({})
const posterImages = ref({});
const progress = ref(storeStunt.uploadProgress)
const posterProgress = ref(storeStunt.uploadPosterProgress)
const fileCount = ref(storeStunt.uploadFileCount);
storeStunt.setUploadStatus("WAITING");
const uploadStatus = ref(storeStunt.uploadStatus)

watch(() => storeStunt.uploadProgress, (newProgress) => {
    if(newProgress > 100) {
        newProgress = 100
    }
    progress.value = newProgress;
})

watch(() => storeStunt.uploadPosterProgress, (newProgress) => {
    if(newProgress > 100) {
        newProgress = 100
    }
    console.log("POSTER PROGRESS")
    posterProgress.value = newProgress;
})

watch(() => storeStunt.uploadFileCount, (newCount) => {
    fileCount.value = newCount
})

watch(() => storeStunt.uploadStatus, (newStatus) => {
    uploadStatus.value = newStatus
})

watch(() => posterImages.value, () => {
    console.log(posterImages.value, "POSTER IMG")
})

// variables for getting all the info into an object
const name = ref(null);
const discipline = ref(null);
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
let isUpdate = false;

let stuntId = null

const existingMedia = ref(null)
const existingMediaFolderId = ref(null)


onMounted(() => {
    if(storedNameAndDisciplines[0]?.name){
        name.value = storedNameAndDisciplines[0].name
        if(storedNameAndDisciplines[0]?.discipline){
            addNameAndDisciplines(storedNameAndDisciplines[0].name, storedNameAndDisciplines[0].discipline)
            name.value = ""
            discipline.value = "";
        }
    } 
    isUpdate = storeStunt.isUpdate
    console.log(isUpdate)
    if(isUpdate){
        console.log("IN UPDATE MOUNT", storeStunt)
        nameAndDisciplines.value = storeStunt.nameAndDisciplines
        difficulty.value = storeStunt.difficulty
        elevation.value = storeStunt.elevation
        movement.value = storeStunt.movement
        popStatus.value = storeStunt.isPop
        disconnectsStatus.value = storeStunt.disconnects
        counterBalanceStatus.value = storeStunt.isCounterBalance
        altNames.value = storeStunt.altNames
        notes.value = storeStunt.notes
        
        stuntId = storeStunt.stuntId

        if(storeStunt.media){
            existingMedia.value = storeStunt.media
            console.log("MEDIA OD EXISTING", existingMedia.value)
            if(storeStunt.media.length != 0){
                existingMediaFolderId.value = storeStunt.media[0].folderId
                storeStunt.media.forEach(mediaData => {
                    fileInputElement.value.presetMedia(mediaData)
                });
                
            }
        }

        
    }
})

function changeStatus() {
    storeStunt.setUploadStatus("WAITING")
}

function toMainPage() {
    console.log("THIS RAN")
    storeStunt.setUploadStatus("WAITING")
    router.push("/admin/manageStunt")
}

function createSubmitConfig() {
    return {
        nameAndDisciplines: nameAndDisciplines.value,
        difficulty: Number(difficulty.value),
        elevation: elevation.value,
        movement: movement.value,
        isPop: popStatus.value,
        isCounterBalance: counterBalanceStatus.value,
        disconnects: disconnectsStatus.value,
        altNames: altNames.value,
        notes: notes.value,
    }

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
    storeStunt.setUploadStatus("START");
    const submitConfig = createSubmitConfig();

    if(!isSubmitConfigValid(submitConfig)){
        console.log("CONFIG NOT VALID")
        storeStunt.setUploadStatus("CONFIG NOT VALID")
        return;
    }

    storeStunt.setUploadStatus("START CONVERTING...")
    let videoFilesMP4 = []
    let videoFiles = [];
    let photoFiles = [];
    let videoDemonstratorsMP4 = []
    let videoDemonstrators = []
    let photoDemonstrators = []

    console.log(demonstratorsToConvert.value, "DEMO TO CONVERT IS")
    for(let i = 0; i < filesToConvert.value.length; i++){
        let file = filesToConvert.value[i]
        let currentDemonstrators = toRaw(demonstratorsToConvert.value['file_' + i]) ?? [];
        console.log("CURRENT DEMO", currentDemonstrators)
        if(file.type.match('video/*')){
            if(file.type.match("video/mp4")) {
                console.log("ISMP4")
                videoFilesMP4.push(file)
                videoDemonstratorsMP4.push(currentDemonstrators)
            } else {
                videoFiles.push(file);
                videoDemonstrators.push(currentDemonstrators);
            }
        } else {
            photoFiles.push(file);
            photoDemonstrators.push(currentDemonstrators);
        }
    }

    if(videoFiles){
        if(videoFiles.length != 0){
            const convertedVideos = await convertVideosToMP4(videoFiles)
            if(!convertedVideos) {
                console.log("There was a failure in converting")
                storeStunt.setUploadStatus("FAILED CONVERSION");
                return
            }
            videoFiles = convertedVideos
        }
    }

    let allDemonstrators = [...videoDemonstratorsMP4, ...videoDemonstrators, ...photoDemonstrators];
    for(let i = 0; i < allDemonstrators.length; i++){
        demonstrators.value['file_' + i] = allDemonstrators[i]
    }
    let allFiles = [...videoFilesMP4, ...videoFiles, ...photoFiles];
    files.value = allFiles




    storeStunt.setUploadStatus("CONVERSION COMPLETED")


    var folderId = "";
    let didUploadMedia = false;
    console.log(existingMedia.value, "EXITING MIEDA VALUE IS")
    var media = existingMedia.value ?? []
    var newMediaUploadNames = []
    const posterLength = Object.keys(posterImages.value).length
    var numberOfPostersUploaded = 0
    // attempt to post files to strorage
    if(files.value.length) {
        storeStunt.setUploadStatus("UPLOADING FILES")
        folderId = existingMediaFolderId.value ?? makeId(15)
        //implement later demonstrators should link to there user ID
        for (var i = 0; i < files.value.length; i++) {
            const file = files.value[i];
            const posterFile = toRaw(posterImages.value["video_"+file.name.slice(0, file.name.lastIndexOf('.'))]) || null
            if(posterFile){
                numberOfPostersUploaded++
            }
            storeStunt.setUploadFileCount((i + 1 + numberOfPostersUploaded) + " of " + (files.value.length + posterLength))
            
            console.log("POSGER IMAGES ARE IN ADD NEW", posterFile)

            await uploadNewStuntMediaToBucket(folderId, file, posterFile)
            .then(result => {
                newMediaUploadNames.push(file.name)
                console.log("UPLOAD RESULT", result)
                if(posterFile){
                    newMediaUploadNames.push(posterFile.name) 
                }
                var mediaInfo = {
                    id: makeId(10),
                    name: file.name,
                    folderId,
                    type: file.type,
                    mediaURL: result.mediaURL,
                    demonstrators: demonstrators.value['file_' + i] || []
                }
                if(result.posterURL){
                    mediaInfo['posterURL'] = result.posterURL
                }
                media.push(mediaInfo);
                //TODO finish vidoes stuff
                didUploadMedia = true;
                isUploadMediaSuccess.push(true)
            })
            .catch((error) => {
                alert(error);
                isUploadMediaSuccess.push(false);
            })

        }
        storeStunt.setUploadStatus("UPLOAD FINSIHED")
    }

    console.log(media, "MEDIA IS")

    const hasFalseInMediaUpload = isUploadMediaSuccess.find(value => value == false)
    if(hasFalseInMediaUpload){
        storeStunt.setUploadStatus("UPLOAD FAILED")
        return;
    }

    submitConfig.media = media;
    
    if(isUpdate){
        storeStunt.setUploadStatus("UPDATING");
        console.log(submitConfig)
        try {

            if(!stuntId){
                console.error("NO STUNT ID")
                return
            }
            
            const updateSuccess = await updateStunt(stuntId, submitConfig)
            if(updateSuccess) {
                    storeStunt.setUploadStatus("UPDATE SUCCESS")
                    clearInputBoxes(); 
            } else {
                storeStunt.setUploadStatus("UPDATE FAILED");
                console.log("Post Failed")
                if(didUploadMedia){
                    console.log("removing media")
                    newMediaUploadNames.forEach(newMediaName => {
                        removeMedia(folderId, newMediaName)
                    })      
                }
            }
        } catch (error) {
            console.log(error)
            storeStunt.setUploadStatus("UPDATE FAILED");
            alert("could not update stunt")
            console.log("deleting newly uploaded items");
            if(didUploadMedia){
                newMediaUploadNames.forEach(newMediaName => {
                    removeMedia(folderId, newMediaName)
                })
            }
        }
        return
    }


    storeStunt.setUploadStatus("POSTING");
    try {
        console.log("Post config", submitConfig)
        const postSuccess = await postStunt(submitConfig)
        if(postSuccess) {
            storeStunt.setUploadStatus("POST SUCCESS")
            clearInputBoxes(); 
        } else {
            storeStunt.setUploadStatus("POST FAILED");
            console.log("Post Failed")
            if(didUploadMedia){
                console.log("removing media")
                removeAllMediaFromFolder(folderId)
            }
        }
        
    } catch (error) {
        console.log(error)
        storeStunt.setUploadStatus("POST FAILED");
        alert("could not post stunt")
        console.log("deleting uploaded items");
        if(didUploadMedia){
            removeAllMediaFromFolder(folderId)
        }
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

    // clear stuff from child componet
    demonstrators.value = [];
    fileInputElement.value.clearFiles()
    fileInputElement.value.clearAllDemonstrators()
    fileInputElement.value.clearPosterImages()
    files.value = []
    
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
    filesToConvert.value = event;
}

function getExistingUpdatedMedia(event) {
    existingMedia.value = event
    console.log(existingMedia.value, "IMSIDE ADDNEW")
}

function getDemonstrators(event) {
    demonstratorsToConvert.value = event;
}

function getPosterImage(event){
    posterImages.value = event
}

</script>

<style scoped lang="scss">
.main-container {
    margin: 5px;
    color: var(--primary-text-color);
    height: calc(100vh - 66px);
    width: inherit;
    overflow-y: scroll;
}

.nameAndDiscipline-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: space-evenly;
    align-items: center;


    .addButton {
        width: 50px;
        margin: 5px;
    }

    .items {
        margin: 5px;
    }
}

.nameAndDiscipline-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;

    p {
        padding: 3px;
    }
}

.moreInfo-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 120px;
}

.mainInfo, .extraInfo{
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
}

.extraInfo {
    text-align: left;
    span {
        padding: 7px;
    }
}

.file-container {
    margin-top: 5px;
    margin-bottom: 20px;
}

</style>