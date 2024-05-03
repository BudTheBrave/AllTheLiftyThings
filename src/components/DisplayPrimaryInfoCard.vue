<template>
    <div class="bodyContainer">
        <div id="card"
        @click="handleClick()">
            <div class="rowWrapper">
                <div class="infoContainer">
                        <div class="nameContainer" v-if="stuntData.nameAndDisciplines">
                            <StuntIconBanner :stuntIcon="getDisciplineIcon(stuntData.nameAndDisciplines[0].discipline)" 
                                            class="stuntIcon"/>
                            <div class="nameP"> 
                                <p>{{ stuntData.nameAndDisciplines[0].name }}</p>
                            </div>
                        </div>
                    <hr />
                    <div class="infoP">
                        <p>Movement: {{ stuntData.movement }}</p>
                        <StarRating :numberRating="Number(stuntData.difficulty)"/>
                        <p>Level: {{ stuntData.elevation }}</p>
                    </div>
                </div>
                <hr style="margin-right: auto;"/>

                <div class="previewMediaContainer">
                    <div v-if="mediaIcon.type.match('video/*')">
                        <video class="mediaVideoDisplay" muted>
                            <source 
                              :src="mediaIcon.src" 
                              :type="mediaIcon.type" 
                            />
                            Not Supported
                        </video>
                    </div>
                    <div v-else>
                        <img :src="mediaIcon.src" class="mediaImageDisplay"/>
                    </div>
                </div>
            </div>
        </div>     
    </div>
</template>

<script setup>
    import StarRating from './StarRating.vue'
    import { defineProps, toRef, ref} from 'vue'
    import { useRouter } from 'vue-router'
    import { getDisciplineIcon } from '../Mixins.js'
    import { useStuntStore } from '@/stores/stuntStore'
    import StuntIconBanner from './StuntIconBanner.vue'
    import defaultMediaIcon from '../assets/noMediaIcon.png'
    

    const stuntStore = useStuntStore();

    const props = defineProps({
        stuntData: {
            required: true
        }
    })

    const stuntData = toRef(props.stuntData)
    const mediaIcon = ref(getMediaIcon())

    const router = useRouter();
            

    function handleClick() {
        updateStuntStore();
        if(/^\/admin\//.test(router.currentRoute.value.fullPath)){
            stuntStore.setIsUpdate(true)
            router.push({
                 name: 'addNewStunt',
            })
            return
        }
        router.push({
            name: "stunt",
            params: { id: props.stuntData.nameAndDisciplines[0].discipline + "_" + props.stuntData.nameAndDisciplines[0].name.replace(/ /g, '_')},
        }
        )


    }

    function updateStuntStore(){
        stuntStore.$reset();
        stuntStore.setData(props.stuntData)
    }

function getMediaIcon() {
        let returnObj = {
                type: 'image/png',
                src: defaultMediaIcon
        }
        if(props.stuntData?.media){
            const media = props.stuntData.media;
            if(media.length == 0){
                return returnObj;
            }
            for(let i = 0; i < media.length; i++){
                if(media[i].type.match('video/*')){
                    if(media[i].type == "video/mp4" || media[i].type == "video/webm") {
                        return {
                            type: media[i].type,
                            src: media[i].mediaURL
                        }
                    } else {
                        return {
                            type: "video/mp4",
                            src: media[i].mediaURL
                        }
                    }
                } else if(media[i].type.match('image/*')){
                    return {
                        type: media[i].type,
                        src: media[i].mediaURL
                    }
                }
            }
            return returnObj
        } else {
            return returnObj
        }
    }
        
</script>

<style scoped lang="scss">

#card {
    flex: 1;
    height: 100px;
    width: 90%;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    margin: 5px 5px 5px 5px;
    font-size: 2.75vw;
    color: var(--primary-text-color);
    background-color: lighten(#363636, 10%);
    border-radius: 15px;
}

.bodyContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 110px;
    margin: 0px;
}

.infoContainer {
    display: flex;
    flex-direction: column;
    width: calc(100% - 100px);
    height: inherit;
    padding: 0px;
}

p {
    margin: 0px;
}

.nameP {
    position: relative;
    z-index: 100;
    width: calc(100% - 15px);
    margin-left: 15px;
    text-align: center;
}

.stuntIcon {
    position: absolute;
    top: 0;
    left: 0;
}

.nameContainer{
    height: 25px;
    font-size: 1.25em;
    font-weight: bold;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0px 0px 0px 0px;
}
.infoP {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    padding: 3px;
}

.rowWrapper {
    display: flex;
    flex-direction: row;
    height: inherit;
    width: 100%;
}

hr {
    margin: 0px;
    border: 1px solid black;
}

.previewMediaContainer {
    width: 80px;
    height: 80px;
    padding: 10px;
    border-radius: 20px;
    overflow: hidden;

    .mediaImageDisplay{
        max-width: 80px;
        max-height: 80px;
        border-radius: 10px;
    }

    .mediaVideoDisplay {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 10px;
    }

}



</style>