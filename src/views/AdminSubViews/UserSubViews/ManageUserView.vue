<template>
    <div class="container">
        <div @click="router.replace('./')" class="goBack">Go Back</div>
        <h1> Admin User Editing</h1>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter();


</script>

<style scoped>

.container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

}


.goBack {
    width: 100px;
    height: auto;
    text-align: center;
    font-size: 1.1em;
    border: 1px solid black;
    box-shadow: 0px 4px 6px black;
}

</style>