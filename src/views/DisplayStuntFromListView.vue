<template>
    <div class="wrapper">
        <h2 style="height: 30px; margin: 10px">{{ routeType }}</h2>
        <div v-if="ids == [] || !ids">
            <p>None {{ routeType }}</p>
        </div>
        <div v-else>
            <Suspense>
                <InfiniteScroll :search-params="ids"/>
                <template #fallback> 
                    <p>Loading...</p>
                </template>
            </Suspense>
        </div>
    </div>
</template>

<script setup>
import InfiniteScroll from '@/components/InfiniteScroll.vue';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()

console.log(route)
const ids = ref({ "ids": route.params.ids })

const routeType = ref(route.params.type)

watch(() => route.path, () => {
    ids.value = {"ids": route.params.ids }
    routeType.value = route.params.type

})

</script>

<style scoped>
.wrapper{
    height: calc(100vh - 90px);
    background-color: inherit;
}
</style>