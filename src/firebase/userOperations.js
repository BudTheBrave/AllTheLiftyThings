import defaultProfileIcon from '../assets/profileIcon.jpeg'
import { db, auth, namespaceFirebase } from "./index";

const usersRef = db.collection("Users");


function addUser(user){
    return new Promise((resolve, reject) =>{
        const {uid, email, displayName, photoURL} = user
        const profileData = {
            email,
            ...(displayName) && {displayName: displayName },
            photoURL: (photoURL) ? photoURL : defaultProfileIcon,
            dateCreated: new Date().toJSON().slice(0, 19)
        }

        console.log(uid, "and", profileData)
        usersRef.doc(uid).set(profileData)
        .then((user) => {
            console.log("added user successfully");
            resolve(user);
        }).catch((error) => {
            console.log("error:", error)
            reject(error)
        })
    })
}


function isAnUser(uid){
    return new Promise((resolve, reject) => {
        usersRef.doc(uid).get()
        .then((doc) => {
            if(doc.exists){
                console.log("user exists");
                resolve(true);
            } else {
                resolve(false);
            }
        })
        .catch((error) => {
            console.log(error);
            reject(error);
        })
    })
}


function userSignOut(){
    return new Promise((reslove) => {
        auth.signOut().then(() =>{
            console.log("signed out")
            reslove()
        })
    })
}

function getUserData(uid) {
    return new Promise((reslove, reject) => {
        console.log(uid, "UID is")
        usersRef.doc(uid).get()
        .then((doc) => {
            if(doc.exists){
                reslove(doc.data())
            } else{
                reslove("NO USER TO ID")
            }
        })
        .catch((error) => {
            console.log(error);
            reject(error)
        })
    })
}
// true = checked
// false = unchecked
import { useUserStore } from '@/stores/userStore';
function updateUserSaveFields(key, stuntId, action, uid) {
    return new Promise((reslove) => {
        const userStore = useUserStore();
        let currentUserField = userStore.userData[key] || [];
        
        if(action === "selected") {
            if(currentUserField.includes(stuntId)) {
                console.log("In favorites Already")
                reslove()
            }
         
         
            usersRef.doc(uid).update({
                [key]: namespaceFirebase.firestore.FieldValue.arrayUnion(stuntId)
            }).then(() => {
                console.log(`${key} updated successfully.`);
                // Update Pinia state to include the new ID in the array
                userStore.updateUserData({
                  ...userStore.userData,
                  [key]: [...currentUserField, stuntId]
                });
                reslove()
              })
              .catch(function(error) {
                console.error(`Error updating ${key}: `, error);
                reslove()
              });
        } else if (action === 'deselected') {
            if (!currentUserField.includes(stuntId)) {
              console.log(`ID ${stuntId} is not in ${key}.`);
              reslove() // Exit function if ID is not in the array
            }
        
            // Update the array in Firebase

            usersRef.doc(uid).update({
              [key]: namespaceFirebase.firestore.FieldValue.arrayRemove(stuntId)
            })
            .then(function() {
              console.log(`${stuntId} removed successfully from ${key}.`);
              // Update Pinia state to remove the ID from the array
              userStore.updateUserData({
                ...userStore.userData,
                [key]: currentUserField.filter(item => item !== stuntId)
              });
              reslove()
            })
            .catch(function(error) {
              console.error(`Error removing ${stuntId} from ${key}: `, error);
              reslove()
            });
          } else {
            console.error("Invalid action. Please provide 'select' or 'deselect'.");
            reslove()
          }
    })
}


export { addUser, isAnUser, userSignOut, getUserData, updateUserSaveFields }