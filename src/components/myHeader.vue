<template>
    <div class="headContainer">
        <RouterLink to="/" class="headerDiv">
            <img 
                :src="require('../assets/liftyThingsLogo.png')" 
                alt="Lift Logo"
                class="menuIcon"
            />
            <a class="headerTitle">Lift Dictonary</a>
        </RouterLink>
    </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'

</script>

<style scoped>

.headerDiv {
    display: flex;
    flex-direction: row;
    text-align: justify;
    align-items: center;
    height: 50px;
    width: 80vw;
    margin: 0px;
    padding: 3px;
}


.headerDiv .headerTitle {
    position: relative;
    width: auto;
    max-height: 50px;
    line-height: 0.8em;
    font-size: 9vw;
    margin-left: 2vw;
    color: var(--primary-dark-teal);
}
    
.menuIcon {
    max-height: 50px;
    max-width: 50px;
    min-width: 50px;
    min-height: 50px;
    height: auto;
    padding: 0px;
    margin: 0px 0 0 0;
    align-self: center;
}

.menuIcon > hr {
    width: 30px;
    height: 30px;
    border: solid black;
}

.headContainer {
    width: 100vw;
    display: flex;
}

</style>