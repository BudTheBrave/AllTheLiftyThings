import {storage} from "../firebase/index.js"

const storageRef = storage.ref();


import { useStuntStore } from "@/stores/stuntStore.js";
function uploadNewStuntMediaToBucket(folderId, file, posterFile){
    const stuntStore = useStuntStore();
    stuntStore.setProgress(0)
    stuntStore.setPosterProgress(0)
    var URLs = {}; 
    return new Promise((resolve, reject) => {
        if(!folderId || !file || !(file instanceof File)){
            alert("not valid inputs. can not post file")
            reject(null);
        }  

        var successfulUploads = 0
        const filesToUpload = [file]

        if(posterFile != null) {
            if(!(posterFile instanceof File)){
                alert("poster file was not null but not a File")
                reject(null)
            } else {
                filesToUpload.push(posterFile)
                const uploadTask = storageRef.child(folderId + "/" + posterFile.name).put(posterFile);
                uploadTask.on('state-change', (snapshot) => {
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    stuntStore.setPosterProgress(Math.trunc(progress))
                    switch(snapshot.state) {
                        case 'paused':
                            console.log("upload poster is paused");
                            break;
                        case 'running':
                            console.log("upload poster is running");
                            break;    
                    }
                }, (error) => {
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
                }, async () => {
                    console.log("success");
                    const downloadURL = await uploadTask.snapshot.ref.getDownloadURL() 
                    console.log(downloadURL);
                    URLs['posterURL'] = downloadURL
                    successfulUploads++
                    if(successfulUploads == filesToUpload.length){
                        resolve(URLs)
                    }
                })
        }
    }           

    


        const uploadTask = storageRef.child(folderId + "/" + file.name).put(file);
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
        }, (error) => {
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
        }, async () => {
            console.log("success");
            const downloadURL = await uploadTask.snapshot.ref.getDownloadURL() 
            console.log(downloadURL);
            URLs['mediaURL'] = downloadURL
            successfulUploads++
            if(successfulUploads == filesToUpload.length){
                resolve(URLs)
            }
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