function getDisciplineIcon(discipline) {
    if(discipline == 'Acrobatics'){
        return "[A]";
    } else if (discipline == 'Ballroom') {
        return "[B]";
    } else if (discipline == "Swing") {
        return "[S]"
    } else if (discipline == "Cheer"){
        return "[C]"
    } else {
        return "[O]"
    }
}

const disciplineDropdownConfig = [
    "Ballroom",
    "Acrobatics",
    "Cheer",
    "Swing"
]

const elevationDropdownConfig = [
    "Below Waistline",
    "Waistline",
    "Shoulders",
    "Above Shoulders"
]

const movementConfig = [
    "Stationary",
    "Rotational",
    "Acrobatic"
]


function capitalizeFirstLetters(stringToCap) {
    const arr = stringToCap.split(" ");
    for (var i = 0; i < arr.length; i++){
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }
    return arr.join(" ");

}

// mixin for video conversion
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { useStuntStore } from './stores/stuntStore';

// Define a function to convert videos to MP4
async function convertVideosToMP4(videos) {

    const stuntStore = useStuntStore()
    stuntStore.setUploadStatus("START")

    // Initialize FFmpeg
    const ffmpeg = new FFmpeg({ log: true });
    await ffmpeg.load();

    // Array to store converted videos
    const convertedVideos = [];
    let currentFileNumber = 0;

    ffmpeg.on("progress", ({ progress, time}) => {
        console.log("PROGRESS:", progress, "\nTIME:", time)
        stuntStore.setProgress(Math.trunc(progress * 100));
        console.log(stuntStore.uploadProgress)
    })

    // Iterate through the array of videos
    stuntStore.setUploadStatus("CONVERTING...")
    for (const video of videos) {
        currentFileNumber++
        stuntStore.setUploadFileCount(currentFileNumber + " of " + videos.length)
        try {
            // Fetch the video file
            const fileData = await fetchFile(video);
            
            // Write the video file to FFmpeg virtual file system
            await ffmpeg.writeFile('input', fileData);
            
            

            // Execute FFmpeg command to convert the video to MP4
            await ffmpeg.exec(['-i', 'input', '-c:v', 'copy', 'output.mp4']);
            
            // Read the converted MP4 file
            const data = await ffmpeg.readFile('output.mp4');
            
            const blob = new Blob([data], { type: 'video/mp4'})
            const convertedFile = new File([blob], `${video.name.replace(/\.[^/.]+$/, '.mp4')}`, { type: 'video/mp4' })
            // Push the converted video data to the array
            convertedVideos.push(convertedFile);
        } catch (error) {
            console.error(`Error converting ${video} to MP4:`, error);
            return null
        }
        
    }

    stuntStore.setUploadStatus("CONVERSION DONE")
    // Return the array of converted videos
    return convertedVideos;
}

function makeId(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}



export { getDisciplineIcon, disciplineDropdownConfig, elevationDropdownConfig, movementConfig, capitalizeFirstLetters, convertVideosToMP4, makeId}