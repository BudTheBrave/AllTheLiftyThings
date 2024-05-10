<script setup>
//import { uploadNewStuntToBucket } from "../firebase/storageOperations.js"
import { ref, defineEmits, defineExpose, toRaw } from "vue"
import { capitalizeFirstLetters } from "@/Mixins";
import BaseInput from "../components/BaseInput.vue"

const files = ref([]);
const demonstratorsRef = ref({});
const demonstrators = ref({})

const existingMedia = ref([]);
const existingDemonstratorsRef = ref({})

const posterImage = ref({});


/** index == file position
 * [
 *  [name1, name2]
 *  [name1, name2]
 *  [name1, name2, name3, name4]
 * ]
 */

defineExpose({clearFiles, clearAllDemonstrators, clearAll, presetMedia, clearPosterImages});
const emit = defineEmits(['pushFiles', 'pushDemonstrators', 'pushExistingMedia', 'pushPosterImage'])

function addTofileArray(e) {
    if(!e.target.files){
        return;
    }
    Array.from(e.target.files).forEach(async (file) => {
        if(!files.value.find(e => e.name === file.name)){
            if(file.type.match('video/*')){
                const posterURL = await generatePosterImage(file)
                console.log("E NAME", file.name, posterURL)
                posterImage.value['video_' + getJustFileName(file.name)] = posterURL
                console.log("AFTER SET", posterImage.value)

            }
            console.log(file)
            files.value.push(file);
            console.log("EMITING DATA")
            emitData()
        } else {
            console.log("file already submitted")
        }        
    })
}

function getJustFileName(filename){
    return filename.slice(0, filename.lastIndexOf('.'));
}

function removeEntry(array, index) {
    console.log("remove array", array)
    array.splice(index, 1)
    console.log(array)
    emitData()
}

function getFileSrc(file) {
    return URL.createObjectURL(file);
}

function clearAll(){
    files.value = []
    demonstrators.value = {}
    existingMedia.value = {}
    posterImage.value = {}
}

function clearFiles() {
    files.value = []
}

function clearAllDemonstrators(){
    demonstrators.value = {}

}

function clearPosterImages() {
    posterImage.value = {}
}

function clearDemonstratorField(fullIndex){
    demonstratorsRef.value[fullIndex] = "";
}


function addDemonstratorName(array, demonstratorNameParam, index) {
    if(demonstratorNameParam === ""){
        return;
    }

    console.log(demonstratorNameParam, "demo name param");
    const name = capitalizeFirstLetters(demonstratorNameParam)
    const fullIndex = 'file_' + index;

    if(array[fullIndex]){
        if(array[fullIndex].find(value => value === name)) {
            console.log("already in array")
        } else {
            array[fullIndex].push(name);
            clearDemonstratorField(fullIndex)
            console.log(array, "array")
        }
    } else {
        array[fullIndex] = [];
        array[fullIndex].push(name);
        clearDemonstratorField(fullIndex)
    }
    emitData()
}

function addDemonstratorNameToExistingMedia(array, demonstratorNameParam, index) {
    if(demonstratorNameParam === ""){
        return;
    }

    const name = capitalizeFirstLetters(demonstratorNameParam)
    const fullIndex = 'file_' + index;

    if(array){
        if(array.find(value => value === name)){
            console.log("already in array");
        } else {
            array.push(name);
        }
    } else {
        array.push(name)
    }
    console.log(existingMedia)

    existingDemonstratorsRef.value[fullIndex] = "";
    emitData()
}

function removeDemonstrator(fileIndex, demonstratorIndex) {
    demonstrators.value['file_' + fileIndex].splice(demonstratorIndex, 1);
    emitData()
}

function presetMedia(media){
    console.log(media, "PRE MEDIA IS")
    existingMedia.value.push(media)
}

function emitData() {
    emit('pushDemonstrators', demonstrators.value)
    emit('pushFiles', files.value)
    emit('pushExistingMedia', existingMedia.value)
    console.log("EMMITING", toRaw(posterImage.value))
    emit('pushPosterImage', toRaw(posterImage.value))
}


const videoRef = ref(null)
const videoEle = ref(null)
const canvasEle = ref(null)

async function generatePosterImage(e) {
    console.log("CALLED IN FILE THINGY", e)
    return await new Promise((res, rej) => {
        const file = e;
        console.log("FILE", file)
        videoEle.value.src = URL.createObjectURL(file);
        
            videoEle.value.onloadeddata = async () => {
                videoRef.value.style.display = 'block';
                new Promise(() => {setTimeout(async () => {
                    console.log("DATA LOADED")
                    const context = canvasEle.value.getContext('2d');
                    
                    console.log(videoEle.value.videoHeight, videoEle.value.videoWidth, "HEIGHT N WIDTH")
                    canvasEle.value.width = videoEle.value.videoWidth;
                    canvasEle.value.height = videoEle.value.videoHeight;
                    
                    context.drawImage(videoEle.value, 0, 0, canvasEle.value.width, canvasEle.value.height);
                    
                    
                    console.log(canvasEle.value.toDataURL(), "CANVAS DATA URL");
                    // Convert canvas to data URL and set as poster image
                    const dataURL = await canvasEle.value.toDataURL();
                    const blob = await dataURLToBlob(dataURL)
                    const posterFile = toRaw(new File([blob], `${getJustFileName(file.name)}_Poster.png`, { type: 'image/png' }));
                    console.log("BLOB IS", posterFile)
                    // Clean up
                    URL.revokeObjectURL(videoEle.value.src);
                    
                    videoRef.value.style.display = 'none';
                    res(posterFile)
                    
            }, 500);})
            }
            


        videoEle.value.addEventListener('error', (error) => {
            console.log("ERROR", error)
            rej(error)
        })
        

    });
}


function dataURLToBlob(dataURL) {
    return new Promise((res) => {

        const parts = dataURL.split(';base64,');
        const contentType = parts[0].split(':')[1];
        const byteString = atob(parts[1]);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uint8Array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteString.length; i++) {
            uint8Array[i] = byteString.charCodeAt(i);
        }
        res(new Blob([arrayBuffer], { type: contentType }));
    })
}


</script>

<template>

    <div v-if="files.value != []" class="file-list-container">
        <div v-for="(file, fileIndex) in files" :key="file" >
            <div class="file-container">
                <div class="file-image">
                    <div v-if="file.type.match('video/*')">
                        <img  :src="getFileSrc(posterImage['video_'+getJustFileName(file.name)])" alt="Poster Image" class="previewImg">
                    </div>
                    <img v-else :src="getFileSrc(file)" alt="preview file" class="previewImg" />
                </div>
                <div class="file-info">
                    <span>{{ file.name }}
                        <button @click="removeEntry(files, fileIndex)" style="margin-left: 6px; color: red; background-color: lightcoral;">X</button>
                    </span>
                    <BaseInput 
                        v-model="demonstratorsRef['file_'+fileIndex]" 
                        style="padding-right: 10px;"
                        type="text" 
                        placeholder="Demonstrators Names" 
                    />
                    <button @click="addDemonstratorName(demonstrators, demonstratorsRef['file_'+fileIndex], fileIndex)">Add</button>
                    <div v-if="demonstrators['file_' + fileIndex]" class="demonstratorList"> 
                        <div v-for="(demonstrator, demonstratorIndex) in demonstrators['file_' + fileIndex]" :key="demonstrator">
                            <span>{{ demonstrator }}</span>
                            <button @click="removeDemonstrator(fileIndex, demonstratorIndex)" style="margin-left: 6px">X</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>


    <div v-if="existingMedia.length" class="file-list-container">
        <div v-for="(mediaData, mediaIndex) in existingMedia" :key="mediaData">
            <div class="file-container">
                <div class="file-image">
                    <div v-if="mediaData.type.match('video/*')">
                        <video ref="video" style="display: none;"></video>
                        <canvas ref="canvas"></canvas>
                        <img v-if="posterImage" :src="posterImage" alt="Poster Image" style="max-width: 50px">
                    </div>
                    <img v-else  :src="mediaData.mediaURL" style="max-width: 50px"/> 
                </div>
                <div class="file-info">
                    <span>{{ mediaData.name }}
                        <button @click="removeEntry(existingMedia, mediaIndex)" style="margin-left: 6px">X</button>
                    </span>
                    <BaseInput 
                    v-model="existingDemonstratorsRef['file_' + mediaIndex]"
                    style="padding-right: 10px;"
                    type="text" 
                    placeholder="Demonstrators Names"
                    /> 
                    <button @click="addDemonstratorNameToExistingMedia(mediaData.demonstrators ,existingDemonstratorsRef['file_' + mediaIndex], mediaIndex)">add</button>
                    <div v-if="mediaData.demonstrators.length" class="demonstratorList">
                        <div v-for="(demonstrator, demonstratorIndex) in mediaData.demonstrators" :key="demonstrator">
                            <span>{{ demonstrator }}</span>
                            <button @click="removeEntry(mediaData.demonstrators, demonstratorIndex)" style="margin-left: 6px">X</button>
                        </div>   
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div ref="videoRef" style="display: none">
        <video ref="videoEle"></video>
        <canvas ref="canvasEle"></canvas>
    </div>
    
    <div style="text-align: center;">
        <input 
            type="file" 
            name="fileUpload" 
            @change="addTofileArray" 
            accept=""
            multiple/>
    </div> 
</template>

<style lang="css" scoped>
hr {
    color: var(--primary-dark-bg-color)
}
.previewImg {
    max-width: 130px;
    max-height: 145px;
}
/* hides the tool tip text for files */
input[type='file']{
    color: rgba(0,0,0,0)
}

.file-list-container {
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    margin-bottom: 5px;
    width: 100%;
    height: auto;
}

.file-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 160px;
}
.file-image {
    margin-left: 10px;
}
.file-info {
    * {
        margin-block: 3px;
        font-size: 0.8em;
    }
}

.demonstratorList {
    height: 66px;
    overflow-y: scroll;

    * {
        font-size: 0.75em;
    }
}


</style>
