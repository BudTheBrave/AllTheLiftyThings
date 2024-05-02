<template>
    <div class="wrapper">
        <h2 style="height: 30px; margin: 10px">A to Z Page</h2>
        <Suspense>
            <InfiniteScroll />
            <template #fallback> 
                <p>Loading...</p>
            </template>
        </Suspense>
    </div>
</template>

<script setup>

import InfiniteScroll from '@/components/InfiniteScroll.vue';



</script>

<style scoped>
.wrapper{
    height: calc(100vh - 90px);
    background-color: inherit;
}
</style>