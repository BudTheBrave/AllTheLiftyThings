<template>
    <div v-if="stuntDataLoaded">

        <div class="mainContainer">
            <div class="nameDiv">
                <h3>{{ getDisciplineIcon(stuntData.nameAndDisciplines[0].discipline) }} {{ stuntData.nameAndDisciplines[0].name }}</h3>
            </div>
            <hr style="border: 1px solid black">
            <div class="mainInfoDiv">
                <star-rating :numberRating="Number(stuntData.difficulty)" :size="Number(40)"></star-rating>
                <p>{{ stuntData.elevation }}</p>
                <p>{{ stuntData.movement }}</p>
                <p v-if="stuntData.isPop">Pop</p>
                <p v-if="stuntData.isCounterBalance">Counter Balance</p>
                <p v-if="stuntData.disconnects">Disconnects</p>
                <div v-if="stuntData.altNames.length != 0">
                    <span>Alt Names:
                        <span v-for="altName in stuntData.altNames" :key="altName">
                            <span>{{ altName }},</span>
                        </span>
                    </span>
                </div>
            </div>
            <hr>
            <div>
                <div v-if="stuntData.media" >
                    <div v-if="stuntData.media.length != 0" class="videoDiv">
                        <div v-for="media in stuntData.media" :key="media">
                            <div class="videoCard">
                                <div v-if="media.type.match('video/*')">
                                    <video controls muted :poster="media.posterURL">
                                        <source :src="media.mediaURL" type="video/mp4">     
                                        Video type not supported                    
                                    </video>
                                </div>
                                <div v-else>
                                    <img :src="media.mediaURL" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <hr>
            <div class="notesDiv">
                <h4>Notes:</h4>
                <p>{{ stuntData.notes }}</p>
            </div>
            <div class="footerDiv">
                <hr>
                <footer>
                    <img :src="goBackIcon" alt="Go Back Icon" @click="router.go(-1)">
                    <img :src="favoriteImage" alt="favorite Icon" @click="favoriteClicked">
                    <img :src="bookmarkImage" alt="bookmark Icon" @click="bookmarkClicked">
                    <img :src="completedImage" alt="completed Icon" @click="completedClicked">
                </footer>
            </div>

        </div>



    </div>
    <div v-else>Stunt not Found</div>
</template>

<script setup>
import { useRouter } from "vue-router"
import { ref, onMounted } from "vue";
import { useStuntStore } from "@/stores/stuntStore";
import { getDisciplineIcon } from "@/Mixins";
import StarRating from "@/components/StarRating.vue";
import { useUserStore } from "@/stores/userStore";
import { updateUserSaveFields } from "@/firebase/userOperations";
import goBackIcon from '../assets/goBackIcon.png'
import favoriteIcon from '../assets/favoriteIcon.png'
import favoriteIconSelected from '../assets/favoriteIconSelected.png'
import bookmarkIcon from '../assets/bookmarkIcon.png'
import bookmarkIconSelected from '../assets/bookmarkIconSelected.png'
import completedIcon from '../assets/completedIcon.png'
import completedIconSelected from '../assets/completedIconSelected.png'

let stuntStore = null;
let userStore = null
let userUID = null;
const stuntData = ref(null);
const stuntId = ref(null)
const router = useRouter();
const stuntDataLoaded = ref(false)

const bookmarkImage = ref(bookmarkIcon);
let isBookmark = false;

const favoriteImage = ref(favoriteIcon);
let isFavorite = false;

const completedImage = ref(completedIcon);
let isCompleted = false;



onMounted(() => {
    stuntStore = useStuntStore()
    userStore = useUserStore()
    userUID = userStore.$state.user.uid
    stuntData.value = stuntStore.$state
    stuntId.value = stuntData.value.stuntId
    console.log(stuntData.value)
    stuntDataLoaded.value = true
    try {
        if(userStore.$state.userData.favorited.includes(stuntId.value)){
            favoriteImage.value = favoriteIconSelected;
            isFavorite = true;
        }
        if(userStore.$state.userData.bookmarked.includes(stuntId.value)){
            bookmarkImage.value = bookmarkIconSelected;
            isBookmark = true;
        }
        if(userStore.$state.userData.completed.includes(stuntId.value)){
            completedImage.value = completedIconSelected;
            isCompleted = true
        }
    } catch(err) {
        console.log(err)
    }


})

async function favoriteClicked() {
    let action = (isFavorite) ? "deselected" : "selected"
    await updateUserSaveFields("favorited", stuntId.value, action, userUID)
    .then(() => {
        isFavorite = !isFavorite
        favoriteImage.value = (isFavorite) ? favoriteIconSelected : favoriteIcon
    })
    .catch(() => {
        console.log("error")
        return 
    })
}

async function bookmarkClicked() {
    let action = (isBookmark) ? "deselected" : "selected"
    await updateUserSaveFields("bookmarked", stuntId.value, action, userUID)
    .then(() => {
        isBookmark = !isBookmark
        bookmarkImage.value = (isBookmark) ? bookmarkIconSelected : bookmarkIcon
    })
    .catch(() => {
        console.log("error")
        return 
    })
}

async function completedClicked() {
    let action = (isCompleted) ? "deselected" : "selected"
    await updateUserSaveFields("completed", stuntId.value, action, userUID)
    .then(() => {
        isCompleted = !isCompleted
        completedImage.value = (isCompleted) ? completedIconSelected : completedIcon
    })
    .catch(() => {
        console.log("error")
        return 
    })
}




</script>

<style lang="scss" scoped>
hr {
    margin: 0;
}

h1, h2, h3, h4, h5, h6 {
    margin: 5px
}
.mainContainer {
    margin: 20px;
    background-color: lightgray;
    height: calc(100vh - 101px);
    width: calc(100vw - 105px);
    border-radius: 15px;
    display: flex;
    flex-direction: column;
}

.nameDiv {
    display: flex;
    height: 40px;
    align-items: center;
    justify-content: center;
}

.mainInfoDiv {
    margin-block: 10px;

    p {
        margin: 2px; 
    }
}


.footerDiv {
    margin-top: auto;
    height: 50px; 
}

footer {
    display: flex;
    height: 48px;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
    margin-inline: 10px;

    img {
        height: 40px;
        width: auto;
    }
}

/* Hide scrollbar for Chrome, Safari and Opera */
.videoDiv::-webkit-scrollbar {
  display: none;
}

.videoDiv {
    margin: 5px;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    overflow-x: scroll;
    height: 41vh;
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
}

.videoCard {
    margin-right: 10px;
    width: calc(100vw - 125px);

    video, img {
        max-height: 40vh;
        width: 100%;
        object-fit: cover;
        flex-shrink: 0;
    }
}


video:fullscreen {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
 }

 .notesDiv {
    margin: 5px;
    font-size: 0.75em;
    text-align: left;
    overflow-y: scroll;

    h4 {
        margin: 0;
        font-size: 1.1em;
    }
    p {
        margin: 0;
        margin-top: 5px;
    }
 }


</style>