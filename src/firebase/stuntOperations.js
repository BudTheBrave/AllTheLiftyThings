import { db, getCurrentUser } from "./index"
import { disciplineDropdownConfig, capitalizeFirstLetters, makeId } from "@/Mixins";

const stuntRef = db.collection("Stunts");

//return true or false for success or failure
async function postStunt(dataConfig) {
    const currentUser = await getCurrentUser()
    const currentAuthorId = currentUser.uid
    const stuntId = makeId(30)
    console.log("Current USER ID", currentAuthorId)
    return new Promise((resolve) => {
        dataConfig["authorId"] = currentAuthorId
        dataConfig['stuntId'] = stuntId
        console.log("Data config, stuntOperations", dataConfig)
        stuntRef.doc(stuntId).set(dataConfig)
        .then((docRef) => {
            console.log("iD is", docRef);
            resolve(true);
        }).catch((error) => {
            console.log("error is", error);
            resolve(false);
        })
    })
    
}    

function updateStunt(id, config) {
    return new Promise((resolve) => {
        stuntRef.doc(id).update(
            config
        )
        .then(() => {
            console.log("updated Successfully")
            resolve(true)
        })
        .catch(error => {
            console.log(error);
            resolve(false)
        })
    })
}


function getStunt(id) {
    return new Promise((reslove, reject) => {
        stuntRef.doc(id).get()
        .then((doc) => {
            if(doc.exists) {
                reslove (doc.data());
            } else {
                reject("document does not exist")
            }
        })
        .catch((error) => {
            console.log(error)
            reject("error getting doc", error);
        })
    })
    
}


function getStuntsWithLimit(limit, lastDoc, lastAltNameDoc, searchParams) {
    return new Promise((resolve) => {

        let returns = {}
        let query = stuntRef.limit(limit)
        let altNameQuery = stuntRef.limit(limit)
        const searchIds = (searchParams?.ids) ? JSON.parse(JSON.stringify(searchParams.ids)) : null

        console.log("search params ",searchParams)

        if((searchParams && searchParams != []) && !searchIds){
            const nameParam = searchParams?.name || null
            const dis = searchParams?.discipline || null
            var disciplines = [];
            var querySearchObj = [];
            var name = capitalizeFirstLetters(nameParam);

            if(!dis || dis == [] || dis == "all"){
                disciplines = disciplineDropdownConfig;
            } else if(typeof dis === "string"){
                disciplines.push(dis);
            }
            
            disciplines.forEach(discipline => {
                querySearchObj.push({
                    name,
                    discipline
                })
            })
            
            query = query.where(
                'nameAndDisciplines', 
                'array-contains-any', 
                querySearchObj)

            altNameQuery = altNameQuery.where(
                'altNames', 
                "array-contains",
                name)    
            
            if(lastAltNameDoc){
                altNameQuery.startAfter(lastAltNameDoc)
            }

            altNameQuery
            .get()
            .then((querySnapshot) => {
                let data = querySnapshot.docs.map(id => id.data())
                if(data.length == 0){
                    returns['lastAltNameDoc'] = lastAltNameDoc
                } else {
                    let otherData = returns.data || []
                    returns['data'] = [...otherData, ...data];
                    returns['lastAltNameDoc'] = querySnapshot.docs[querySnapshot.docs.length - 1]
                }
            })
            .catch((error) => {
                console.log(error);
                resolve([])
            })    
        }

        console.log("OHH YESS")
        if(lastDoc){
            query = query.startAfter(lastDoc)
        }
        if(searchIds){
            console.log("seatch IDS", searchIds)
            query = query.where("stuntId", 'in', searchIds)
        }

        console.log("query is", query)
        query.get()
        .then((querySnapshot) => {
            const data = querySnapshot.docs.map(id => id.data())
            console.log("result is", data)
            if(data.length == 0){
                console.log("SHOULD BE THE LAST DOC")
                returns['lastMainDoc'] = lastDoc
            } else {
                console.log("THERES WAS DATA", data)
                let otherData = returns.data || []
                returns['data'] = [...data, ...otherData];
                returns['lastMainDoc'] = querySnapshot.docs[querySnapshot.docs.length - 1];
            }
            console.log("RETURin", returns)
            resolve(returns)
        })
        .catch((error) => {
            console.log(error)
        })
       
    })
}

/**
 * 
 * @param {} name String, *req*
 * @param {} dis String, "all", Array, Und, Null, Empty
 * @returns 
 */


function searchForStunt(nameParam, dis) {
    return new Promise((resolve) => {
        
        if(!nameParam){
            resolve([]);
        }

        const matchingDocuments = [];
        var query = stuntRef
        var disciplines = [];
        var querySearchObj = [];
        var name = capitalizeFirstLetters(nameParam);

        //
        if(!dis || dis == [] || dis == "all"){
            disciplines = disciplineDropdownConfig;
        } else if(typeof dis === "string"){
            disciplines.push(dis);
        }

        disciplines.forEach(discipline => {
            querySearchObj.push({
                name,
                discipline
            })
        })

        query = query.where(
            'nameAndDisciplines', 
            'array-contains-any', 
            querySearchObj)

        query.get()
        .then((quarySnapshot) => {
            quarySnapshot.forEach((doc) => {
                if(matchingDocuments.find((matchingId) => {
                    matchingId == doc.id;
                })) {
                    console.log("duplicate Ids")
                }
                matchingDocuments.push(doc.id);
            });
        }).catch((error) => {
            resolve([]);
            console.log(error);
        })



        stuntRef.where('altNames', "array-contains", name)
        .get()
        .then((quarySnapshot) => {
            quarySnapshot.forEach((doc) => {
                if(matchingDocuments.find((matchingId) => { matchingId == doc.id; })){
                    console.log("duplicate Ids")
                }
                matchingDocuments.push(doc.id);
            })
            resolve(matchingDocuments);
        })
        .catch((error) => {
            console.log(error);
            resolve([])
        })



        
    });
}

function deleteStunt(id){
    return new Promise((reslove, reject) => {
        stuntRef.doc(id).delete()
        .then(() => {
            console.log("stunt successfuly deleted")
            reslove()
        })
        .catch((error) => {
            console.log(error)
            reject();
        })
    })
}


export { postStunt, searchForStunt, getStunt, updateStunt, deleteStunt, getStuntsWithLimit }