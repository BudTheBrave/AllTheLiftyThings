import {storage} from "../firebase/index.js"

const storageRef = storage.ref();


import { useStuntStore } from "@/stores/stuntStore.js";
function uploadNewStuntMediaToBucket(folderId, file){
    const stuntStore = useStuntStore();
    stuntStore.setProgress(0)
    return new Promise((resolve, reject) => {
        if(!folderId || !file || !(file instanceof File)){
            alert("not valid inputs. can not post file")
            reject(null);
        }   

        
    
        const uploadTask = storageRef.child(folderId + "/" + file.name).put(file)
        uploadTask.on('state-change', (snapshot) => {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            stuntStore.setProgress(Math.trunc(progress))

            switch(snapshot.state) {
                case 'paused':
                    console.log("upload is paused");
                    break;
                case 'running':
                    console.log("upload is running");
                    break;    
            }
        },
        (error) => {
            console.log(error.code);
            switch(error.code) {
                case 'storage/unauthorized':
                    console.log("no auth")
                    // User doesn't have permission to access the object
                    break;
                case 'storage/canceled':
                    console.log("upload canceled")
                    // User canceled the upload
                    break;
                case 'storage/unknown':
                    console.log("unknown error")
                    // Unknown error occurred, inspect error.serverResponse
                    break;
            }
            alert(error)
            reject(null);
        },
        async () => {
            console.log("success");
            const downloadURL = await uploadTask.snapshot.ref.getDownloadURL() 
            console.log(downloadURL);
            resolve(downloadURL)
        })
    })

}

function doesMediaExist(folderId, mediaId){
    return new Promise((reslove) => {
        reslove( (storageRef.child(folderId + "/" + mediaId).getDownloadURL()) ? true : false )
        
    })
}

function removeAllMediaFromFolder(folderId){
    storageRef.child(folderId + "/").listAll()
    .then((res) => {
        res.items.forEach(itemRef => {
            console.log("ITEMS IN FOLDER TO DELETE", itemRef);
            removeMedia(folderId, itemRef.name);
        })
    })
    .catch((error) => {
        console.log(error)
    })
}

function removeMedia(folderId, mediaName){
    return new Promise((reslove, reject) => {
        storageRef.child(folderId + "/" + mediaName).delete()
    .then(() => {
        console.log("media removed at", folderId + "/" + mediaName)
        reslove("success");
    })
    .catch(error => {
        console.log(error)
        reject("error");
    })
    })
    
}


export {storageRef, removeMedia, uploadNewStuntMediaToBucket, removeAllMediaFromFolder, doesMediaExist} 