<template>
    <div>
        <span v-if="!isNumberRatingValid()">**UNRATED**</span>
        <span v-for="n in fullStars" :key="n">
            <img src="../assets/SingleStarTrans.png"
            :style="cssProps">
        </span>
        <span v-if="isHalfStar">
            <img src="../assets/HalfStarTrans.png"
            :style="cssProps">
        </span>
        <span v-for="n in emptyStars" :key="n">
            <img src="../assets/EmptyStarTrans.png"
            :style="cssProps">
        </span>
    </div>
</template>

<script>
    export default {
        name: 'StarRating',
        props: {
            numberRating: {
                type: Number,
                required: true
            },
            size: {
                type: Number ,
                default: 20,
            }
        },
        data() {
            return {
                halfStarUsed: false,
                errorText: 'Error'
            }
        },
        computed: {
            fullStars: function() {
                if(this.isNumberRatingValid()){
                    var arr = [];
                    for(var i = 1; i <= this.numberRating; i++) {
                        arr.push(i);
                    }
                    return arr;
                }   
                return null
            },
            emptyStars: function() {
                if(this.isNumberRatingValid()){
                    var numOfEmptyStars = Math.trunc(5 - this.numberRating);
                    var arr = [];
                    for(var i = 1; i <= numOfEmptyStars; i++){
                        arr.push(i);
                    }
                    return arr;
                }   
                return null
            },
            isHalfStar: function() {
                if(this.isNumberRatingValid()){
                    if(this.numberRating % 1 != 0){
                        return true;
                    }
                }
                return false;
            },
            cssProps() {
                console.log("THIS RAN")
                return {
                    '--image-size': (this.$props.size) + "px"
                }
            }
        },
        methods: {    
            isNumberRatingValid() {
                if(this.numberRating >= 0 && this.numberRating <= 5 && this.numberRating % 0.5 == 0 && this.numberRating != null) {
                    return true;
                }  
                else {
                    return false;
                
                }
            },
            errorMessage: function(){
                var numRating = this.numberRating;
                if(numRating == null) {
                    return "Error: Does Not Exist"
                }
                else if (isNaN(numRating)){
                    return "Error: Is Not A Number"
                }
                else if(!(this.numberRating >= 0 && this.numberRating <= 5)){
                    return "Error: Out Of Bounds";
                }
                else if(!(this.numberRating % 0.5 == 0)){
                    return "Error: Is Not Disvisable By 0.5"
                }
                return "Error: Unknown Error";       
            }
        }
            
    }
</script>

<style scoped>
img {
    width: var(--image-size);
    height: var(--image-size);
}
</style>