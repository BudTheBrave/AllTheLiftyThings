import { defineStore } from 'pinia'

export const useStuntStore = defineStore('stunt',{
    state: () => ({
        stuntId: "",
        selectedType: "",
        nameAndDisciplines: [],
        difficulty: Number(),
        elevation: "",
        movement: "",
        isPop: false,
        isCounterBalance: false,
        disconnects: false,
        altNames: [],
        notes: "",
        media: [],
        uploadProgress: 0,
        uploadPosterProgress: 0,
        uploadFileCount: 0,
        uploadStatus: null,
        isUpdate: false
    }),
    actions: {
        $reset(){
            this.stuntId = "";
            this.selectedtype = "";
            this.nameAndDisciplines = [] 
            this.difficulty = Number()
            this.elevation = ""
            this.movement = ""
            this.isPop = false
            this.isCounterBalance = false
            this.disconnects = false
            this.altNames = []
            this.notes = ""
            this.media = []
            this.uploadProgress = 0
            this.uploadPosterProgress = 0
            this.uploadFileCount = 0
            this.uploadStatus = null
            this.isUpdate = false
        },
        replaceNameAndDiscipline(obj) {
            this.nameAndDisciplines = [];
            this.nameAndDisciplines.push(obj)
        },
        clearNameAndDiscipline(){
            this.nameAndDisciplines = []

        },
        setStuntId(id) {
            this.stuntId = id;
        },
        setPulledData(id, data, selectedType){
            this.stuntId = id ;
            this.selectedType = selectedType;
            this.nameAndDisciplines = data.nameAndDisciplines 
            this.difficulty = data.difficulty
            this.elevation = data.elevation
            this.movement = data.movement
            this.isPop = data.isPop
            this.isCounterBalance = data.isCounterBalance
            this.disconnects = data.isCounterBalance
            this.altNames = data.altNames || []
            this.notes = data.notes || ""
            this.media = data.media || []
        },
        setData(data){
            this.stuntId = data.stuntId || ""
            this.nameAndDisciplines = data.nameAndDisciplines 
            this.difficulty = data.difficulty
            this.elevation = data.elevation
            this.movement = data.movement
            this.isPop = data.isPop
            this.isCounterBalance = data.isCounterBalance
            this.disconnects = data.isCounterBalance
            this.altNames = data.altNames || []
            this.notes = data.notes || ""
            this.media = data.media || []
        },
        setProgress(progress){
            this.uploadProgress = progress
        },
        setPosterProgress(progress){
            this.uploadPosterProgress = progress
        },
        setUploadFileCount(count){
            this.uploadFileCount = count
        },
        setUploadStatus(status){
            this.uploadStatus = status
        },
        setIsUpdate(bool){
            this.isUpdate = bool
        },
    },
    getters: {

    },
    persist: {
        key: '__Pinia_State__Stunt',
        storage: sessionStorage
        
    }
})